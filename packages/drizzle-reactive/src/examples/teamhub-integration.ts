/**
 * Example integration of @drizzle/reactive with TeamHub
 *
 * This shows how the reactive library would be used in the existing
 * TeamHub codebase to provide zero-config reactive database features.
 */

import { z } from 'zod'
import { createReactiveDb, defineReactiveFunction } from '../index'
import type { ReactiveConfig } from '../core/types'

// Example TeamHub reactive configuration
export const teamhubReactiveConfig: ReactiveConfig = {
  relations: {
    // When agents change, invalidate messages, memory, and organization queries
    agent: [
      'organization.organizationId',
      'message.fromAgentId',
      'message.toAgentId',
      'memory.agentId',
      'tool.organizationId',
    ],

    // When organizations change, invalidate all org-scoped data
    organization: [
      'agent.organizationId',
      'tool.organizationId',
      'user.organizationId',
      'memory.organizationId',
    ],

    // When messages change, invalidate sender/receiver agents
    message: [
      'agent.fromAgentId',
      'agent.toAgentId',
      'conversation.conversationId',
    ],

    // When memory changes, invalidate related agents
    memory: ['agent.agentId', 'organization.organizationId'],

    // When tools change, invalidate organization and agent data
    tool: ['organization.organizationId', 'agent.organizationId'],
  },

  // Smart defaults for cache and real-time features
  cache: {
    server: { provider: 'redis' }, // Use Redis in production
    client: { provider: 'localStorage' }, // Persist across browser sessions
  },

  realtime: {
    enabled: true,
    transport: 'sse', // Perfect for Vercel deployment
    reliability: {
      acknowledgments: true, // Ensure important events are delivered
      maxRetries: 3,
      retryDelays: [2000, 5000, 10000], // 2s, 5s, 10s
    },
  },
}

// Example reactive functions for TeamHub

/**
 * Get all agents for an organization with reactive caching
 */
export const getAgents = defineReactiveFunction({
  id: 'agents.getAll',
  input: z.object({
    organizationId: z.string(),
  }),
  dependencies: ['agent'], // Only invalidate when agents table changes
  handler: async ({ input, db }) => {
    return await db.agents.findMany({
      where: { organizationId: input.organizationId },
      orderBy: { createdAt: 'desc' },
    })
  },
})

/**
 * Get agent with statistics (complex multi-table query)
 */
export const getAgentWithStats = defineReactiveFunction({
  id: 'agents.getWithStats',
  input: z.object({
    agentId: z.string(),
    organizationId: z.string(),
  }),
  dependencies: ['agent', 'message', 'memory'], // Depends on multiple tables

  // Fine-grained invalidation: only invalidate for this specific agent
  invalidateWhen: {
    agent: (change) => change.keys.includes('agentId'), // Simplified for example
    message: (change) => change.keys.includes('agentId'),
    memory: (change) => change.keys.includes('agentId'),
  },

  handler: async ({ input, db }) => {
    const agent = await db.agents.findUnique({
      where: { id: input.agentId, organizationId: input.organizationId },
    })

    const messageCount = await db.messages.count({
      where: { fromAgentId: input.agentId },
    })

    const memoryCount = await db.memory.count({
      where: { agentId: input.agentId },
    })

    const recentMessages = await db.messages.findMany({
      where: { fromAgentId: input.agentId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return {
      agent,
      stats: {
        messageCount,
        memoryCount,
        lastActive: recentMessages[0]?.createdAt || null,
      },
      recentMessages,
    }
  },
})

/**
 * Update agent (mutation with automatic invalidation)
 */
export const updateAgent = defineReactiveFunction({
  id: 'agents.update',
  input: z.object({
    id: z.string(),
    organizationId: z.string(),
    data: z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      systemPrompt: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
  }),
  dependencies: ['agent'], // This mutation affects the agent table
  handler: async ({ input, db }) => {
    const updatedAgent = await db.agents.update({
      where: {
        id: input.id,
        organizationId: input.organizationId,
      },
      data: input.data,
    })

    // The reactive system will automatically:
    // 1. Invalidate all queries that depend on 'agent' table
    // 2. Broadcast invalidation to all connected clients
    // 3. Trigger revalidation of active hooks first
    // 4. Handle background revalidation for inactive queries

    return updatedAgent
  },
})

/**
 * Example of how the reactive database would be created in TeamHub
 */
export function createTeamHubReactiveDb(drizzleInstance: any) {
  return createReactiveDb(drizzleInstance, teamhubReactiveConfig)
}

// Example usage in TeamHub components:
/*
// In a React component:
function AgentsList({ organizationId }: { organizationId: string }) {
  const { data: agents, isStale } = useReactive('agents.getAll', { organizationId })

  // ✅ Shows cached data instantly
  // ✅ Auto-revalidates when agents table changes
  // ✅ Real-time updates via SSE
  // ✅ Smart priority (active hooks first)
  // ✅ Type-safe with full IntelliSense

  return (
    <div>
      {isStale && <div className="text-sm text-gray-500">Syncing...</div>}
      {agents?.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}

// In the agent detail page:
function AgentDetail({ agentId, organizationId }: AgentDetailProps) {
  const { data: agentData, isLoading } = useReactive('agents.getWithStats', {
    agentId,
    organizationId,
  })

  // Only invalidates when this specific agent changes
  // Much more efficient than invalidating all agent queries

  if (isLoading || !agentData) return <Skeleton />

  return (
    <div>
      <h1>{agentData.agent.name}</h1>
      <p>Messages: {agentData.stats.messageCount}</p>
      <p>Memories: {agentData.stats.memoryCount}</p>
      {agentData.recentMessages.map(msg => (
        <MessageCard key={msg.id} message={msg} />
      ))}
    </div>
  )
}
*/
