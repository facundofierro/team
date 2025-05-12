import {
  eq,
  and,
  or,
  asc,
  inArray,
  isNull,
  gte,
  lte,
  sql,
  desc,
} from 'drizzle-orm'
import { db } from '../index'
import { cached, genRandomId, get, invalidate, keys, set } from '../utils'
import {
  agents,
  messages,
  tools,
  cron,
  organization as organizationTable,
  messageType,
  toolTypes,
  users,
} from '../schema'
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
} from '../types'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { migrate as migrateNeon } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'
import * as embeddingsSchema from '../connections/embeddings/schema'
import * as memorySchema from '../connections/memory/schema'
import { createClient } from '@vercel/postgres'
import { createDatabase } from './utils/database'

// Organization functions
export async function createOrganization(
  data: NewOrganization
): Promise<Organization> {
  const dbPrefix = `team-${data.databaseName}`

  try {
    // Create databases with schemas
    await Promise.all([
      createDatabase(dbPrefix),
      createDatabase(`${dbPrefix}_emb`, 'embeddings'),
      createDatabase(`${dbPrefix}_mem`, 'memory'),
    ])

    const [organization] = await db
      .insert(organizationTable)
      .values(data)
      .returning()

    return organization
  } catch (error) {
    console.error('Error creating organization databases:', error)
    throw error
  }
}

export async function getOrganizations(
  userId: string
): Promise<Organization[]> {
  const result = await db
    .select()
    .from(organizationTable)
    .where(eq(organizationTable.userId, userId))
  return result as Organization[]
}

export async function getOrganizationSettings(
  organizationId: string
): Promise<OrganizationSettings> {
  const messageTypes = await db
    .select()
    .from(messageType)
    .where(eq(messageType.organizationId, organizationId))
    .orderBy(asc(messageType.name))
  const organizationTools = await db
    .select()
    .from(tools)
    .where(eq(tools.organizationId, organizationId))
    .orderBy(asc(tools.name))
  const allToolTypes = await db
    .select()
    .from(toolTypes)
    .orderBy(asc(toolTypes.type))
  const organizationUsers = await db
    .select()
    .from(users)
    .where(eq(users.organizationId, organizationId))
    .orderBy(asc(users.name))
  return {
    organizationId,
    messageTypes: messageTypes as MessageType[],
    tools: organizationTools.map((tool) => ({
      ...tool,
      configuration: tool.configuration as Record<string, string>,
      schema: tool.schema as Record<string, unknown>,
      metadata: tool.metadata as Record<string, unknown>,
    })) as ToolWithTypes[],
    toolTypes: allToolTypes as ToolType[],
    users: organizationUsers as User[],
  }
}

export async function updateOrganizationSettings(
  settings: OrganizationSettings
) {
  const { messageTypes, organizationId } = settings

  // Get existing message types
  const existingMessageTypes = await db
    .select()
    .from(messageType)
    .where(eq(messageType.organizationId, organizationId))

  // Create a map of existing message types by ID for easy lookup
  const existingTypesMap = new Map(
    existingMessageTypes.map((type) => [type.id, type])
  )

  // Update or insert message types
  const updatePromises = messageTypes.map(async (type) => {
    if (existingTypesMap.has(type.id)) {
      // Update existing message type
      return db
        .update(messageType)
        .set({
          name: type.name,
          isActive: true,
          // Add any other fields that need updating
        })
        .where(
          and(
            eq(messageType.id, type.id),
            eq(messageType.organizationId, organizationId)
          )
        )
    }

    // Insert new message type
    return db.insert(messageType).values({
      ...type,
      organizationId,
      isActive: true,
    })
  })

  // Set isActive = false for message types that are no longer in the settings
  const currentTypeIds = new Set(messageTypes.map((type) => type.id))
  const typesToDeactivate = existingMessageTypes
    .filter((type) => !currentTypeIds.has(type.id))
    .map((type) => type.id)

  if (typesToDeactivate.length > 0) {
    updatePromises.push(
      db
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
}

// Agent functions
export async function createAgent(data: NewAgent): Promise<Agent> {
  const [agent] = await db.insert(agents).values(data).returning()
  return agent as Agent
}

export async function getAgents(organizationId: string): Promise<Agent[]> {
  const result = await db
    .select()
    .from(agents)
    .where(eq(agents.organizationId, organizationId))
  return result as Agent[]
}

export async function getAgent(id: string): Promise<Agent | null> {
  const [agent] = await db.select().from(agents).where(eq(agents.id, id))
  return agent as Agent | null
}

export async function updateAgent(
  id: string,
  data: Partial<NewAgent>
): Promise<Agent> {
  const [agent] = await db
    .update(agents)
    .set(data)
    .where(eq(agents.id, id))
    .returning()
  return agent
}

// Message functions
export async function createMessage(data: NewMessage): Promise<Message> {
  const [message] = await db.insert(messages).values(data).returning()
  return message
}

export async function getMessage(id: string): Promise<Message | null> {
  const [message] = await db.select().from(messages).where(eq(messages.id, id))
  return message || null
}

export async function getAgentMessages(agentId: string): Promise<Message[]> {
  return db
    .select()
    .from(messages)
    .where(
      or(eq(messages.fromAgentId, agentId), eq(messages.toAgentId, agentId))
    )
}

// Tool functions
export async function createTool(data: NewTool): Promise<Tool> {
  const [tool] = await db.insert(tools).values(data).returning()
  return tool as ToolWithTypes
}

export async function getTool(id: string): Promise<ToolWithTypes | null> {
  const [tool] = await db.select().from(tools).where(eq(tools.id, id))
  return tool as ToolWithTypes | null
}

export async function getActiveTools(): Promise<ToolWithTypes[]> {
  const activeTools = await db
    .select()
    .from(tools)
    .where(eq(tools.isActive, true))
  return activeTools.map((tool) => ({
    ...tool,
    configuration: tool.configuration as Record<string, string>,
    schema: tool.schema as Record<string, unknown>,
    metadata: tool.metadata as Record<string, unknown>,
  })) as ToolWithTypes[]
}

function isAllowedTime(allowedTimeStart: string, allowedTimeEnd: string) {
  const now = new Date()
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(allowedTimeStart, 10)
  )
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(allowedTimeEnd, 10)
  )
  return now >= start && now <= end
}

export async function verifyToolUsage(toolTypeId: string) {
  const [toolType] = await db
    .select()
    .from(toolTypes)
    .where(eq(toolTypes.id, toolTypeId))

  if (!toolType) {
    const newType = await db
      .insert(toolTypes)
      .values({
        id: toolTypeId,
        type: toolTypeId,
        monthlyUsage: 1,
        configurationParams: {},
      })
      .returning()
    return newType[0]
  }

  const hasExceededUsage = toolType.monthlyUsage >= toolType.allowedUsage
  const isWithinAllowedTime = isAllowedTime(
    toolType.allowedTimeStart,
    toolType.allowedTimeEnd
  )

  if (hasExceededUsage || !isWithinAllowedTime) {
    return false
  }

  await db
    .update(toolTypes)
    .set({
      monthlyUsage: (toolType.monthlyUsage || 0) + 1,
    })
    .where(eq(toolTypes.id, toolTypeId))

  return true
}

// Cron functions
export async function createCron(data: NewCron): Promise<Cron> {
  const [cronResult] = await db.insert(cron).values(data).returning()
  return cronResult
}

export async function updateCronStatus(
  id: string,
  isActive: boolean
): Promise<Cron> {
  const [cronResult] = await db
    .update(cron)
    .set({ isActive })
    .where(eq(cron.id, id))
    .returning()
  return cronResult
}

export async function updateMessage(
  id: string,
  data: Partial<Message>
): Promise<Message> {
  const [message] = await db
    .update(messages)
    .set(data)
    .where(eq(messages.id, id))
    .returning()
  return message
}

export async function getActiveCrons(): Promise<Cron[]> {
  return db.select().from(cron).where(eq(cron.isActive, true))
}

export async function getCron(id: string): Promise<Cron | null> {
  const [cronResult] = await db.select().from(cron).where(eq(cron.id, id))
  return cronResult || null
}

export async function updateCronLastRun(id: string): Promise<Cron> {
  const [cronResult] = await db
    .update(cron)
    .set({
      lastRun: new Date(),
      nextRun: new Date(),
    })
    .where(eq(cron.id, id))
    .returning()
  return cronResult
}

export async function createNewAgent(parentId?: string) {
  'use server'

  const newAgent = await createAgent({
    id: genRandomId(),
    name: 'New Agent',
    role: 'assistant',
    parentId: parentId || null,
    doesClone: false,
    systemPrompt: '',
    maxInstances: 1,
    policyDefinitions: {},
    memoryRules: {},
    toolPermissions: {},
    isActive: true,
  })

  return newAgent
}
