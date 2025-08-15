import { defineReactiveFunction } from '@drizzle/reactive/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { agents, messages, organization } from '../../schema'
import { getFunctions as getMemoryFunctions } from '../../connections/memory/functions'
import { getOrgDb } from '../../functions/utils/database'
import type { Agent, NewAgent } from '../../types'

// Schema for agent creation
const createAgentSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  role: z.string(),
  doesClone: z.boolean().default(false),
  parentId: z.string().optional(),
  systemPrompt: z.string().default(''),
  maxInstances: z.number().default(1),
  policyDefinitions: z.record(z.string(), z.unknown()).default({}),
  memoryRules: z.record(z.string(), z.unknown()).default({}),
  toolPermissions: z.record(z.string(), z.unknown()).default({}),
  isActive: z.boolean().default(true),
})

// Schema for agent updates
const updateAgentSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  doesClone: z.boolean().optional(),
  parentId: z.string().optional(),
  systemPrompt: z.string().optional(),
  maxInstances: z.number().optional(),
  policyDefinitions: z.record(z.string(), z.unknown()).optional(),
  memoryRules: z.record(z.string(), z.unknown()).optional(),
  toolPermissions: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
})

// Get all agents for an organization
export const getAgents = defineReactiveFunction({
  name: 'agents.getAll',
  input: z.object({
    organizationId: z.string(),
    limit: z.number().optional().default(50),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, input.organizationId))
      .limit(input.limit)

    return result as Agent[]
  },
})

// Get a single agent by ID
export const getAgent = defineReactiveFunction({
  name: 'agents.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id))

    return (result[0] as Agent) || null
  },
})

// Create a new agent
export const createAgent = defineReactiveFunction({
  name: 'agents.create',
  input: createAgentSchema as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .insert(agents)
      .values(input as NewAgent)
      .returning()

    return result[0] as Agent
  },
})

// Update an existing agent
export const updateAgent = defineReactiveFunction({
  name: 'agents.update',
  input: z.object({
    id: z.string(),
    data: updateAgentSchema,
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .update(agents)
      .set({
        ...input.data,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, input.id))
      .returning()

    return result[0] as Agent
  },
})

// Delete an agent (soft delete by setting isActive to false)
export const deleteAgent = defineReactiveFunction({
  name: 'agents.delete',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .update(agents)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, input.id))
      .returning()

    return result[0] as Agent
  },
})

// Get messages for an agent
export const getAgentMessages = defineReactiveFunction({
  name: 'agents.messages.getAll',
  input: z.object({
    agentId: z.string(),
    limit: z.number().optional().default(100),
  }) as any,
  dependencies: ['message'],
  handler: async (input, db) => {
    const result = await db.db
      .select()
      .from(messages)
      .where(eq(messages.fromAgentId, input.agentId))
      .limit(input.limit)
      .orderBy(messages.createdAt)

    return result
  },
})

// Get memories for an agent (reactive wrapper around legacy memory functions)
export const getAgentMemories = defineReactiveFunction({
  name: 'agents.memory.getAll',
  input: z.object({
    agentId: z.string(),
    organizationId: z.string(),
  }) as any,
  dependencies: ['memory'],
  handler: async (input, db) => {
    // Resolve tenant DB and reuse memory functions; auto-create DB if missing
    try {
      // Resolve organization's database name from main DB
      const orgRow = await db.db
        .select({ databaseName: organization.databaseName })
        .from(organization)
        .where(eq(organization.id, input.organizationId))
        .limit(1)

      if (!orgRow[0]?.databaseName) {
        console.warn(
          `⚠️ agents.memory.getAll: organization ${input.organizationId} not found or missing databaseName`
        )
        return []
      }

      const orgDb = await getOrgDb(orgRow[0].databaseName)
      const memoryFns = getMemoryFunctions(orgDb as any)
      return await memoryFns.getAgentMemories(input.agentId)
    } catch (error: any) {
      if (error?.code === '3D000') {
        // Org DB not initialized -> propagate so client doesn't cache empty results
        console.warn(
          `⚠️ agents.memory.getAll: org DB ${input.organizationId} missing; propagating error`
        )
      }
      throw error
    }
  },
})

// Update agent conversation state
export const updateAgentConversationState = defineReactiveFunction({
  name: 'agents.updateConversationState',
  input: z.object({
    agentId: z.string(),
    activeConversationId: z.string().nullable(),
    lastMessages: z
      .array(
        z.object({
          id: z.string(),
          role: z.enum(['user', 'assistant']),
          content: z.string(),
          timestamp: z.string(),
        })
      )
      .optional(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const [result] = await db.db
      .update(agents)
      .set({
        activeConversationId: input.activeConversationId,
        lastMessages: input.lastMessages || [],
        lastConversationUpdatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agents.id, input.agentId))
      .returning()

    return result as Agent
  },
})

// Get agent with conversation state
export const getAgentWithConversationState = defineReactiveFunction({
  name: 'agents.getWithConversationState',
  input: z.object({
    agentId: z.string(),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const [result] = await db.db
      .select()
      .from(agents)
      .where(eq(agents.id, input.agentId))

    return result as Agent
  },
})

// Get all agents with conversation state for an organization
export const getAgentsWithConversationState = defineReactiveFunction({
  name: 'agents.getAllWithConversationState',
  input: z.object({
    organizationId: z.string(),
    limit: z.number().optional().default(50),
  }) as any,
  dependencies: ['agent'],
  handler: async (input, db) => {
    const result = await db.db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, input.organizationId))
      .limit(input.limit)

    return result as Agent[]
  },
})
