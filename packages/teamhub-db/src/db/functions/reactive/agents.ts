import { defineReactiveFunction } from '@drizzle/reactive'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { agents, messages } from '../../schema'
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
