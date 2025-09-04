import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'
import { getAgents, reactiveDb } from '@agelum/db'

export type AgentDiscoveryParameters = {
  searchQuery?: string
  role?: string
  status?: 'active' | 'inactive' | 'all'
  capabilities?: string[]
  limit?: number
  sortBy?: 'name' | 'role' | 'created' | 'lastActive'
  sortOrder?: 'asc' | 'desc'
  includeMetadata?: boolean
}

export type AgentInfo = {
  id: string
  name: string
  role: string
  isActive: boolean
  systemPrompt?: string
  capabilities?: string[]
  toolsAvailable?: number
  maxInstances?: number
  createdAt?: string
  description?: string
  tags?: string[]
  availability?: 'available' | 'busy' | 'offline'
}

export type AgentDiscoveryResult = {
  success: boolean
  totalFound: number
  agents: AgentInfo[]
  searchQuery?: string
  filters: {
    role?: string
    status?: string
    capabilities?: string[]
  }
  message: string
}

export const agentDiscovery: ToolTypeDefinition = {
  id: 'agentDiscovery',
  type: 'agentDiscovery',
  description:
    'Discover and search for other agents within the organization. Find agents by name, role, capabilities, or status to understand who is available for collaboration and communication.',
  canBeManaged: false, // Internal tool, no external API costs
  managedPrice: 0,
  managedPriceDescription: 'Internal agent discovery - no cost',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 10000, // High limit for internal discovery
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    // No external configuration needed - uses organization context
  },
  parametersSchema: z.object({
    searchQuery: z
      .string()
      .optional()
      .describe('Search term to find agents by name, role, or description'),
    role: z
      .string()
      .optional()
      .describe(
        'Filter agents by specific role (e.g., "assistant", "analyst", "developer")'
      ),
    status: z
      .enum(['active', 'inactive', 'all'])
      .default('active')
      .describe('Filter agents by their active status'),
    capabilities: z
      .array(z.string())
      .optional()
      .describe(
        'Filter agents by specific capabilities or tools they have access to'
      ),
    limit: z
      .number()
      .min(1)
      .max(100)
      .default(20)
      .describe('Maximum number of agents to return'),
    sortBy: z
      .enum(['name', 'role', 'created', 'lastActive'])
      .default('name')
      .describe('How to sort the results'),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('asc')
      .describe('Sort order: ascending or descending'),
    includeMetadata: z
      .boolean()
      .default(false)
      .describe(
        'Include detailed metadata like tools, capabilities, and system prompts'
      ),
  }),
  resultSchema: z.object({
    success: z.boolean().describe('Whether the search was successful'),
    totalFound: z
      .number()
      .describe('Total number of agents found matching criteria'),
    agents: z
      .array(
        z.object({
          id: z.string().describe('Unique agent identifier'),
          name: z.string().describe('Agent display name'),
          role: z.string().describe('Agent role or job function'),
          isActive: z
            .boolean()
            .describe('Whether the agent is currently active'),
          systemPrompt: z
            .string()
            .optional()
            .describe('Agent system prompt/description'),
          capabilities: z
            .array(z.string())
            .optional()
            .describe('List of agent capabilities'),
          toolsAvailable: z
            .number()
            .optional()
            .describe('Number of tools available to agent'),
          maxInstances: z
            .number()
            .optional()
            .describe('Maximum concurrent instances'),
          createdAt: z
            .string()
            .optional()
            .describe('When the agent was created'),
          description: z.string().optional().describe('Agent description'),
          tags: z
            .array(z.string())
            .optional()
            .describe('Agent tags for categorization'),
          availability: z
            .enum(['available', 'busy', 'offline'])
            .optional()
            .describe('Current availability status'),
        })
      )
      .describe('List of agents matching search criteria'),
    searchQuery: z
      .string()
      .optional()
      .describe('The search query that was used'),
    filters: z
      .object({
        role: z.string().optional(),
        status: z.string().optional(),
        capabilities: z.array(z.string()).optional(),
      })
      .describe('Filters that were applied to the search'),
    message: z
      .string()
      .describe('Human-readable description of search results'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<AgentDiscoveryResult> => {
    console.log('🔍 Agent Discovery Tool: Starting search')
    console.log(
      '📋 Discovery Tool: Received params:',
      JSON.stringify(params, null, 2)
    )

    const {
      searchQuery,
      role,
      status = 'active',
      capabilities = [],
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      includeMetadata = false,
    } = params as AgentDiscoveryParameters

    try {
      console.log(
        `🔍 Discovery Tool: Searching for agents with query: "${
          searchQuery || 'all'
        }"`
      )

      // For now, we'll search within the current agent's organization
      // TODO: In the future, this should be determined by the agent's context
      // For demo purposes, we'll need to get the organization ID from context

      // Get all agents - in production this should be organization-scoped
      const allAgents = await getAgents.execute(
        { organizationId: '' },
        reactiveDb
      ) // This needs organization context

      console.log(
        `📊 Discovery Tool: Found ${allAgents.length} total agents in organization`
      )

      // Apply filters
      let filteredAgents = allAgents

      // Status filter
      if (status !== 'all') {
        const isActiveFilter = status === 'active'
        filteredAgents = filteredAgents.filter(
          (agent) => agent.isActive === isActiveFilter
        )
        console.log(
          `🔽 Discovery Tool: After status filter (${status}): ${filteredAgents.length} agents`
        )
      }

      // Role filter
      if (role) {
        filteredAgents = filteredAgents.filter((agent) =>
          agent.role.toLowerCase().includes(role.toLowerCase())
        )
        console.log(
          `🔽 Discovery Tool: After role filter (${role}): ${filteredAgents.length} agents`
        )
      }

      // Search query filter (name, role, system prompt)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredAgents = filteredAgents.filter(
          (agent) =>
            agent.name.toLowerCase().includes(query) ||
            agent.role.toLowerCase().includes(query) ||
            (agent.systemPrompt &&
              agent.systemPrompt.toLowerCase().includes(query))
        )
        console.log(
          `🔽 Discovery Tool: After search query filter ("${searchQuery}"): ${filteredAgents.length} agents`
        )
      }

      // Capabilities filter
      if (capabilities.length > 0) {
        // For now, we'll simulate capability filtering based on tool permissions
        // In a real implementation, this would check agent tool permissions
        filteredAgents = filteredAgents.filter((agent) => {
          // Simulate: agents with system prompts mentioning the capabilities
          const agentCapabilities = agent.systemPrompt
            ? agent.systemPrompt.toLowerCase()
            : ''
          return capabilities.some((cap) =>
            agentCapabilities.includes(cap.toLowerCase())
          )
        })
        console.log(
          `🔽 Discovery Tool: After capabilities filter: ${filteredAgents.length} agents`
        )
      }

      // Sort agents
      filteredAgents.sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'role':
            comparison = a.role.localeCompare(b.role)
            break
          case 'created':
            comparison =
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            break
          case 'lastActive':
            // For now, use createdAt as proxy for lastActive
            comparison =
              new Date(a.updatedAt || a.createdAt || 0).getTime() -
              new Date(b.updatedAt || b.createdAt || 0).getTime()
            break
          default:
            comparison = a.name.localeCompare(b.name)
        }

        return sortOrder === 'desc' ? -comparison : comparison
      })

      // Apply limit
      const limitedAgents = filteredAgents.slice(0, limit)
      console.log(
        `📊 Discovery Tool: Returning ${limitedAgents.length} agents (limited from ${filteredAgents.length})`
      )

      // Transform agents to result format
      const agentInfos: AgentInfo[] = limitedAgents.map((agent) => {
        const baseInfo: AgentInfo = {
          id: agent.id,
          name: agent.name,
          role: agent.role,
          isActive: agent.isActive,
        }

        // Add metadata if requested
        if (includeMetadata) {
          baseInfo.systemPrompt = agent.systemPrompt || undefined
          baseInfo.maxInstances = agent.maxInstances || 1
          baseInfo.createdAt = agent.createdAt?.toISOString()

          // Extract capabilities from system prompt (simplified)
          if (agent.systemPrompt) {
            const prompt = agent.systemPrompt.toLowerCase()
            const extractedCapabilities: string[] = []

            // Simple keyword extraction for capabilities
            const capabilityKeywords = [
              'analysis',
              'research',
              'writing',
              'coding',
              'database',
              'api',
              'monitoring',
              'security',
              'testing',
              'deployment',
              'reporting',
              'data processing',
              'machine learning',
              'ai',
            ]

            capabilityKeywords.forEach((keyword) => {
              if (prompt.includes(keyword)) {
                extractedCapabilities.push(keyword)
              }
            })

            baseInfo.capabilities = extractedCapabilities
          }

          // Simulate tool count (in real implementation, would count actual tools)
          const toolPermissions = agent.toolPermissions as any
          baseInfo.toolsAvailable = toolPermissions?.rules?.length || 0

          // Simulate availability (in real implementation, would check actual status)
          baseInfo.availability = agent.isActive ? 'available' : 'offline'

          // Generate description from role and system prompt
          baseInfo.description = agent.systemPrompt
            ? `${agent.role} - ${agent.systemPrompt.substring(0, 100)}${
                agent.systemPrompt.length > 100 ? '...' : ''
              }`
            : `${agent.role} agent`

          // Generate tags from role and capabilities
          baseInfo.tags = [
            agent.role.toLowerCase(),
            ...(baseInfo.capabilities || []),
          ].filter((tag, index, array) => array.indexOf(tag) === index) // Remove duplicates
        }

        return baseInfo
      })

      // Generate result message
      let message = `Found ${filteredAgents.length} agent${
        filteredAgents.length !== 1 ? 's' : ''
      }`
      if (searchQuery) message += ` matching "${searchQuery}"`
      if (role) message += ` with role containing "${role}"`
      if (status !== 'all') message += ` (${status} only)`
      if (limitedAgents.length < filteredAgents.length) {
        message += ` (showing first ${limitedAgents.length})`
      }

      console.log(`✅ Discovery Tool: ${message}`)

      return {
        success: true,
        totalFound: filteredAgents.length,
        agents: agentInfos,
        searchQuery,
        filters: {
          role,
          status: status !== 'all' ? status : undefined,
          capabilities: capabilities.length > 0 ? capabilities : undefined,
        },
        message,
      }
    } catch (error) {
      console.error('💥 Discovery Tool: Error occurred:', error)

      return {
        success: false,
        totalFound: 0,
        agents: [],
        filters: {
          role,
          status,
          capabilities: capabilities.length > 0 ? capabilities : undefined,
        },
        message: `Failed to search agents: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }
    }
  },
}
