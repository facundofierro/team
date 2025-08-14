import { defineReactiveFunction } from '@drizzle/reactive/server'
import { z } from 'zod'
import {
  agents,
  messages,
  tools,
  cron,
  organization as organizationTable,
  messageType,
  toolTypes,
  users,
} from '../../schema'
import type {
  Agent,
  NewAgent,
  Message,
  NewMessage,
  Tool,
  NewTool,
  Cron,
  NewCron,
  NewOrganization,
  Organization,
  OrganizationSettings,
  MessageType,
  ToolType,
  User,
  ToolWithTypes,
} from '../../types'
import { createOrgDatabaseAndSchemas } from '../utils/database'
import { eq, asc, inArray, or, and } from 'drizzle-orm'

// Message functions - this is the key function needed to fix the chat API error
export const createMessage = defineReactiveFunction({
  name: 'messages.create',
  input: z.object({
    id: z.string(), // Required primary key
    fromAgentId: z.string().nullable().optional(),
    toAgentId: z.string().nullable().optional(),
    toAgentCloneId: z.string().nullable().optional(),
    type: z.string(), // This matches the database schema
    content: z.string().nullable().optional(),
    organizationId: z.string(),
    status: z.string().default('pending'), // Required field with default
    metadata: z.record(z.string(), z.unknown()).optional(),
  }) as any,
  dependencies: ['message'],
  handler: async (input, db) => {
    console.log('[createMessage] Input:', input)
    console.log('[createMessage] DB structure:', typeof db, Object.keys(db || {}))
    
    try {
      // Access the actual Drizzle database instance
      const drizzleDb = db.db
      console.log('[createMessage] Drizzle DB:', typeof drizzleDb, Object.keys(drizzleDb || {}))
      
      const result = await drizzleDb
        .insert(messages)
        .values(input)
        .returning()
        
      console.log('[createMessage] Result:', result)
      const [message] = result
      return message
    } catch (error) {
      console.error('[createMessage] Database error:', error)
      throw error
    }
  },
})

export const getMessage = defineReactiveFunction({
  name: 'messages.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['message'],
  handler: async (input, db) => {
    const [message] = await (db as any).db
      .select()
      .from(messages)
      .where(eq(messages.id, input.id))
    return message || null
  },
})

export const getAgentMessages = defineReactiveFunction({
  name: 'agents.messages.getAll',
  input: z.object({
    agentId: z.string(),
  }) as any,
  dependencies: ['message'],
  handler: async (input, db) => {
    return (db as any).db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.fromAgentId, input.agentId),
          eq(messages.toAgentId, input.agentId)
        )
      )
  },
})

// Agent functions
export const getAgents = defineReactiveFunction({
  name: 'agents.getAll',
  input: z.object({
    organizationId: z.string(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await (db as any).db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, input.organizationId))
    return result as Agent[]
  },
})

export const getAgent = defineReactiveFunction({
  name: 'agents.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const [agent] = await (db as any).db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id))
    return agent as Agent | null
  },
})

// Organization functions
export const getOrganizations = defineReactiveFunction({
  name: 'organizations.getAll',
  input: z.object({
    userId: z.string(),
  }) as any,
  dependencies: ['organization'],
  handler: async (input, db) => {
    const result = await (db as any).db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.userId, input.userId))
    return result as Organization[]
  },
})

export const getOrganizationSettings = defineReactiveFunction({
  name: 'organizations.settings.getAll',
  input: z.object({
    organizationId: z.string(),
  }) as any,
  dependencies: ['message_type', 'tool', 'tool_type', 'user'],
  handler: async (input, db) => {
    const messageTypes = await (db as any).db
      .select()
      .from(messageType)
      .where(eq(messageType.organizationId, input.organizationId))
      .orderBy(asc(messageType.name))

    const organizationTools = await (db as any).db
      .select()
      .from(tools)
      .where(eq(tools.organizationId, input.organizationId))
      .orderBy(asc(tools.name))

    const allToolTypes = await (db as any).db
      .select()
      .from(toolTypes)
      .orderBy(asc(toolTypes.type))

    const organizationUsers = await (db as any).db
      .select()
      .from(users)
      .where(eq(users.organizationId, input.organizationId))
      .orderBy(asc(users.name))

    return {
      organizationId: input.organizationId,
      messageTypes: messageTypes as MessageType[],
      tools: organizationTools.map((tool: any) => ({
        ...tool,
        configuration: tool.configuration as Record<string, string>,
        schema: tool.schema as Record<string, unknown>,
        metadata: tool.metadata as Record<string, unknown>,
      })) as ToolWithTypes[],
      toolTypes: allToolTypes as ToolType[],
      users: organizationUsers as User[],
    }
  },
})

// Tool functions
export const getTool = defineReactiveFunction({
  name: 'tools.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['tool'],
  handler: async (input, db) => {
    const [tool] = await (db as any).db
      .select()
      .from(tools)
      .where(eq(tools.id, input.id))
    return tool as ToolWithTypes | null
  },
})

export const createTool = defineReactiveFunction({
  name: 'tools.create',
  input: z.object({
    name: z.string(),
    description: z.string().optional(),
    configuration: z.record(z.string(), z.unknown()).optional(),
    schema: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    version: z.string().optional(),
    isActive: z.boolean().optional(),
    isManaged: z.boolean().optional(),
    organizationId: z.string(),
  }) as any,
  dependencies: ['tool'],
  handler: async (input, db) => {
    const [tool] = await (db as any).db.insert(tools).values(input).returning()
    return tool as ToolWithTypes
  },
})

export const getActiveTools = defineReactiveFunction({
  name: 'tools.getAllActive',
  input: z.object({}) as any,
  dependencies: ['tool'],
  handler: async (input, db) => {
    const activeTools = await (db as any).db
      .select()
      .from(tools)
      .where(eq(tools.isActive, true))
    return activeTools.map((tool: any) => ({
      ...tool,
      configuration: tool.configuration as Record<string, string>,
      schema: tool.schema as Record<string, unknown>,
      metadata: tool.metadata as Record<string, unknown>,
    })) as ToolWithTypes[]
  },
})

// Agent functions - additional ones
export const createAgent = defineReactiveFunction({
  name: 'agents.create',
  input: z.object({
    name: z.string(),
    role: z.string(),
    organizationId: z.string(),
    doesClone: z.boolean().optional(),
    parentId: z.string().nullable().optional(),
    toolPermissions: z.record(z.string(), z.unknown()).optional(),
    isActive: z.boolean().optional(),
    systemPrompt: z.string().optional(),
    maxInstances: z.number().optional(),
    policyDefinitions: z.record(z.string(), z.unknown()).optional(),
    memoryRules: z.record(z.string(), z.unknown()).optional(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const [agent] = await (db as any).db
      .insert(agents)
      .values(input)
      .returning()
    return agent as Agent
  },
})

export const updateAgent = defineReactiveFunction({
  name: 'agents.update',
  input: z.object({
    id: z.string(),
    data: z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      doesClone: z.boolean().optional(),
      parentId: z.string().nullable().optional(),
      toolPermissions: z.record(z.string(), z.unknown()).optional(),
      isActive: z.boolean().optional(),
      systemPrompt: z.string().optional(),
      maxInstances: z.number().optional(),
      policyDefinitions: z.record(z.string(), z.unknown()).optional(),
      memoryRules: z.record(z.string(), z.unknown()).optional(),
    }),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const [agent] = await (db as any).db
      .update(agents)
      .set(input.data)
      .where(eq(agents.id, input.id))
      .returning()
    return agent
  },
})

// Organization functions - additional ones
export const createOrganization = defineReactiveFunction({
  name: 'organizations.create',
  input: z.object({
    databaseName: z.string(),
    name: z.string(),
    userId: z.string(),
    settings: z.record(z.string(), z.unknown()).optional(),
  }) as any,
  dependencies: ['organization'],
  handler: async (input, db) => {
    const dbPrefix = `team-${input.databaseName}`

    try {
      await createOrgDatabaseAndSchemas(input.databaseName)

      const [organization] = await (db as any).db
        .insert(organizationTable)
        .values(input)
        .returning()

      return organization
    } catch (error) {
      console.error('Error creating organization databases:', error)
      throw error
    }
  },
})

export const updateOrganizationSettings = defineReactiveFunction({
  name: 'organizations.settings.update',
  input: z.object({
    messageTypes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        organizationId: z.string(),
        isActive: z.boolean().optional(),
      })
    ),
    tools: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          configuration: z.record(z.string(), z.unknown()).optional(),
          schema: z.record(z.string(), z.unknown()).optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
          version: z.string().optional(),
          isActive: z.boolean().optional(),
          isManaged: z.boolean().optional(),
          organizationId: z.string(),
        })
      )
      .optional(),
    organizationId: z.string(),
  }) as any,
  dependencies: ['message_type', 'tool', 'organization'],
  handler: async (input, db) => {
    const { messageTypes, tools: organizationTools, organizationId } = input

    // Get existing message types
    const existingMessageTypes = await (db as any).db
      .select()
      .from(messageType)
      .where(eq(messageType.organizationId, organizationId))

    // Create a map of existing message types by ID for easy lookup
    const existingTypesMap = new Map(
      existingMessageTypes.map((type: any) => [type.id, type])
    )

    // Update or insert message types
    const updatePromises = messageTypes.map(async (type: any) => {
      if (existingTypesMap.has(type.id)) {
        // Update existing message type
        return (db as any).db
          .update(messageType)
          .set({
            name: type.name,
            isActive: true,
          })
          .where(
            and(
              eq(messageType.id, type.id),
              eq(messageType.organizationId, organizationId)
            )
          )
      }

      // Insert new message type
      return (db as any).db.insert(messageType).values({
        ...type,
        organizationId,
        isActive: true,
      })
    })

    // Set isActive = false for message types that are no longer in the settings
    const currentTypeIds = new Set(messageTypes.map((type: any) => type.id))
    const typesToDeactivate = existingMessageTypes
      .filter((type: any) => !currentTypeIds.has(type.id))
      .map((type: any) => type.id)

    if (typesToDeactivate.length > 0) {
      updatePromises.push(
        (db as any).db
          .update(messageType)
          .set({ isActive: false })
          .where(
            and(
              inArray(messageType.id, typesToDeactivate),
              eq(messageType.organizationId, organizationId)
            )
          )
      )
    }

    // Execute all updates in parallel
    await Promise.all(updatePromises)

    // Handle tools if provided
    if (organizationTools) {
      // Get existing tools
      const existingTools = await (db as any).db
        .select()
        .from(tools)
        .where(eq(tools.organizationId, organizationId))

      // Create a map of existing tools by ID for easy lookup
      const existingToolsMap = new Map(
        existingTools.map((tool: any) => [tool.id, tool])
      )

      // Update or insert tools
      const toolUpdatePromises = organizationTools.map(async (tool: any) => {
        if (existingToolsMap.has(tool.id)) {
          // Update existing tool
          return (db as any).db
            .update(tools)
            .set({
              name: tool.name,
              description: tool.description,
              configuration: tool.configuration,
              schema: tool.schema,
              metadata: tool.metadata,
              version: tool.version,
              isActive: tool.isActive,
              isManaged: tool.isManaged,
            })
            .where(
              and(
                eq(tools.id, tool.id),
                eq(tools.organizationId, organizationId)
              )
            )
        }

        // Insert new tool
        return (db as any).db.insert(tools).values({
          ...tool,
          organizationId,
        })
      })

      // Set isActive = false for tools that are no longer in the settings
      const currentToolIds = new Set(
        organizationTools.map((tool: any) => tool.id)
      )
      const toolsToDeactivate = existingTools
        .filter((tool: any) => !currentToolIds.has(tool.id))
        .map((tool: any) => tool.id)

      if (toolsToDeactivate.length > 0) {
        toolUpdatePromises.push(
          (db as any).db
            .update(tools)
            .set({ isActive: false })
            .where(
              and(
                inArray(tools.id, toolsToDeactivate),
                eq(tools.organizationId, organizationId)
              )
            )
        )
      }

      // Execute all tool updates in parallel
      await Promise.all(toolUpdatePromises)
    }

    // Return updated settings
    return getOrganizationSettings.execute({ organizationId }, db)
  },
})

// Message functions - additional ones
export const updateMessage = defineReactiveFunction({
  name: 'messages.update',
  input: z.object({
    id: z.string(),
    data: z.object({
      content: z.string().optional(),
      status: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
  }) as any,
  dependencies: ['message'],
  handler: async (input, db) => {
    const [message] = await (db as any).db
      .update(messages)
      .set(input.data)
      .where(eq(messages.id, input.id))
      .returning()
    return message
  },
})

// Cron functions
export const createCron = defineReactiveFunction({
  name: 'cron.create',
  input: z.object({
    id: z.string(),
    organizationId: z.string(),
    messageId: z.string().optional(),
    schedule: z.string(),
    isActive: z.boolean().optional(),
    lastRun: z.date().optional(),
    nextRun: z.date().optional(),
  }) as any,
  dependencies: ['cron'],
  handler: async (input, db) => {
    const [cronResult] = await (db as any).db
      .insert(cron)
      .values(input)
      .returning()
    return cronResult
  },
})

export const getActiveCrons = defineReactiveFunction({
  name: 'cron.getAllActive',
  input: z.object({}) as any,
  dependencies: ['cron'],
  handler: async (input, db) => {
    return (db as any).db.select().from(cron).where(eq(cron.isActive, true))
  },
})

export const getCron = defineReactiveFunction({
  name: 'cron.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['cron'],
  handler: async (input, db) => {
    const [cronResult] = await (db as any).db
      .select()
      .from(cron)
      .where(eq(cron.id, input.id))
    return cronResult
  },
})

export const updateCronLastRun = defineReactiveFunction({
  name: 'cron.updateLastRun',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['cron'],
  handler: async (input, db) => {
    const [cronResult] = await (db as any).db
      .update(cron)
      .set({
        lastRun: new Date(),
        nextRun: new Date(),
      })
      .where(eq(cron.id, input.id))
      .returning()
    return cronResult
  },
})

// Helper function for tool usage verification
export const verifyToolUsage = defineReactiveFunction({
  name: 'tools.verifyUsage',
  input: z.object({
    toolTypeId: z.string(),
  }) as any,
  dependencies: ['tool_type'],
  handler: async (input, db) => {
    console.log(
      '🔍 VerifyToolUsage: Checking usage for tool type:',
      input.toolTypeId
    )

    const [toolType] = await (db as any).db
      .select()
      .from(toolTypes)
      .where(eq(toolTypes.id, input.toolTypeId))

    if (!toolType) {
      console.log(
        '🔧 VerifyToolUsage: Tool type not found, creating with default values...'
      )
      const newType = await (db as any).db
        .insert(toolTypes)
        .values({
          id: input.toolTypeId,
          type: input.toolTypeId,
          name: input.toolTypeId,
          description: `Auto-generated tool type for ${input.toolTypeId}`,
          isActive: true,
        })
        .returning()
      return newType[0]
    }

    return toolType
  },
})
