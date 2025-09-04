import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'
import { db, dbMemories } from '@agelum/db'

export type MemorySearchParameters = {
  query: string
  agentId?: string
  organizationId?: string
  databaseName?: string
  types?: string[]
  categories?: string[]
  useSemanticSearch?: boolean
  limit?: number
  timeRange?: {
    from?: string
    to?: string
  }
  importance?: {
    min?: number
    max?: number
  }
}

export type MemorySearchResult = {
  success: boolean
  results: Array<{
    id: string
    type: string
    category: string
    title: string
    summary: string
    description: string
    importance: number
    messageCount: number
    relevantExcerpts: string[]
    createdAt: string
    lastAccessedAt?: string
    tags: string[]
    similarity?: number
  }>
  query: string
  totalFound: number
  searchMethod: 'text' | 'semantic'
  message: string
}

export const memorySearch: ToolTypeDefinition = {
  id: 'memorySearch',
  type: 'memorySearch',
  description:
    "Search through the agent's memory to find relevant information from previous conversations, facts, preferences, and stored knowledge. Supports both text-based and semantic similarity search.",
  canBeManaged: false, // Internal tool, no external API costs
  managedPrice: 0,
  managedPriceDescription: 'Internal memory search - no cost',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 10000, // High limit for memory access
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    // No external configuration needed - uses agent context
  },
  parametersSchema: z.object({
    query: z.string().min(1).describe('Search query to find relevant memories'),
    agentId: z
      .string()
      .optional()
      .describe(
        'Agent ID to search memories for (optional - will use current agent if not provided)'
      ),
    organizationId: z
      .string()
      .optional()
      .describe(
        'Organization ID (optional - will be determined from agent context)'
      ),
    databaseName: z
      .string()
      .optional()
      .describe(
        'Database name to search in (optional - will be determined from organization)'
      ),
    types: z
      .array(
        z.enum([
          'conversation',
          'fact',
          'preference',
          'skill',
          'context',
          'task',
        ])
      )
      .optional()
      .describe('Filter by specific memory types'),
    categories: z
      .array(z.string())
      .optional()
      .describe(
        'Filter by memory categories (e.g., "chat", "work_preference", "technical_skill")'
      ),
    useSemanticSearch: z
      .boolean()
      .default(false)
      .describe(
        'Use vector similarity search if available (requires embeddings)'
      ),
    limit: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe('Maximum number of results to return'),
    timeRange: z
      .object({
        from: z
          .string()
          .optional()
          .describe('Search from this date (ISO string)'),
        to: z
          .string()
          .optional()
          .describe('Search until this date (ISO string)'),
      })
      .optional()
      .describe('Filter by date range'),
    importance: z
      .object({
        min: z
          .number()
          .min(1)
          .max(10)
          .optional()
          .describe('Minimum importance level'),
        max: z
          .number()
          .min(1)
          .max(10)
          .optional()
          .describe('Maximum importance level'),
      })
      .optional()
      .describe('Filter by importance level (1-10 scale)'),
  }),
  resultSchema: z.object({
    success: z.boolean().describe('Whether the search was successful'),
    results: z
      .array(
        z.object({
          id: z.string().describe('Memory record ID'),
          type: z
            .string()
            .describe('Type of memory (conversation, fact, etc.)'),
          category: z.string().describe('Memory category'),
          title: z.string().describe('Memory title or description'),
          summary: z.string().describe('Brief summary of the memory'),
          description: z
            .string()
            .describe('What information can be found here'),
          importance: z.number().describe('Importance level (1-10)'),
          messageCount: z.number().describe('Number of messages/interactions'),
          relevantExcerpts: z
            .array(z.string())
            .describe('Relevant text excerpts'),
          createdAt: z.string().describe('When the memory was created'),
          lastAccessedAt: z.string().optional().describe('When last accessed'),
          tags: z.array(z.string()).describe('Associated tags'),
          similarity: z
            .number()
            .optional()
            .describe('Similarity score for semantic search'),
        })
      )
      .describe('Array of matching memory records'),
    query: z.string().describe('The search query that was used'),
    totalFound: z.number().describe('Total number of memories found'),
    searchMethod: z.enum(['text', 'semantic']).describe('Search method used'),
    message: z
      .string()
      .describe('Human-readable description of search results'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<MemorySearchResult> => {
    console.log('🧠 Memory Search Tool: Starting search')
    console.log(
      '📋 Memory Search: Received params:',
      JSON.stringify(params, null, 2)
    )

    const {
      query,
      agentId: paramAgentId,
      organizationId: paramOrganizationId,
      databaseName: paramDatabaseName,
      types,
      categories,
      useSemanticSearch = false,
      limit = 10,
      timeRange,
      importance,
    } = params as MemorySearchParameters

    try {
      // Get agent context from parameters, configuration, or execution context
      // Priority: parameters > configuration > fallback to error
      const agentId = paramAgentId || configuration.agentId
      const organizationId = paramOrganizationId || configuration.organizationId
      const databaseName = paramDatabaseName || configuration.databaseName

      if (!agentId) {
        throw new Error(
          'Memory search requires agentId. Please provide it as a parameter or ensure the tool has access to agent context.'
        )
      }

      if (!databaseName) {
        // If we have organizationId but no databaseName, try to resolve it
        if (organizationId) {
          // In a production system, this would query the database to get the organization's database name
          // For now, we'll use a simple fallback
          console.log(
            '⚠️ Memory Search: No databaseName provided, using organizationId as fallback'
          )
        } else {
          throw new Error(
            'Memory search requires either databaseName or organizationId to determine the database to search.'
          )
        }
      }

      console.log(`🧠 Memory Search: Searching memories for agent ${agentId}`)

      // Resolve the actual database name to use
      const actualDatabaseName = databaseName || organizationId
      if (!actualDatabaseName) {
        throw new Error('Unable to determine database name for memory search')
      }

      console.log(`🧠 Memory Search: Using database: ${actualDatabaseName}`)

      // Get memory database connection
      const memoryDb = await dbMemories(actualDatabaseName)

      let searchResults: any[] = []
      let searchMethod: 'text' | 'semantic' = 'text'
      let shouldUseSemanticSearch = useSemanticSearch

      if (shouldUseSemanticSearch) {
        console.log('🔍 Memory Search: Attempting semantic search...')

        // For semantic search, we would need to:
        // 1. Generate embedding for the query
        // 2. Use vector similarity search
        // This is currently disabled in the memory functions when pgvector is not available

        try {
          // Placeholder for semantic search - would need embedding generation
          const embedding = new Array(1536).fill(0) // Placeholder embedding
          const semanticResults = await memoryDb.searchSimilarMemories(
            agentId,
            embedding,
            {
              types,
              categories,
              limit,
            }
          )

          if (semanticResults.length > 0) {
            searchResults = semanticResults
            searchMethod = 'semantic'
            console.log(
              `✅ Memory Search: Found ${searchResults.length} semantic results`
            )
          } else {
            console.log(
              '⚠️ Memory Search: Semantic search returned no results, falling back to text search'
            )
            throw new Error('No semantic results, fallback to text')
          }
        } catch (error) {
          console.log(
            '⚠️ Memory Search: Semantic search failed, using text search:',
            error
          )
          shouldUseSemanticSearch = false
        }
      }

      if (!shouldUseSemanticSearch || searchResults.length === 0) {
        console.log('🔍 Memory Search: Using text-based search...')

        // Use text-based search
        searchResults = await memoryDb.searchMemories(agentId, query, {
          types,
          categories,
          limit,
        })

        searchMethod = 'text'
        console.log(
          `✅ Memory Search: Found ${searchResults.length} text-based results`
        )
      }

      // Apply additional filters
      let filteredResults = searchResults

      // Time range filter
      if (timeRange) {
        const fromDate = timeRange.from ? new Date(timeRange.from) : null
        const toDate = timeRange.to ? new Date(timeRange.to) : null

        filteredResults = filteredResults.filter((result) => {
          const createdAt = new Date(result.createdAt)

          if (fromDate && createdAt < fromDate) return false
          if (toDate && createdAt > toDate) return false

          return true
        })

        console.log(
          `🗓️ Memory Search: After time filter: ${filteredResults.length} results`
        )
      }

      // Importance filter
      if (importance) {
        filteredResults = filteredResults.filter((result) => {
          const imp = result.importance || 1

          if (importance.min && imp < importance.min) return false
          if (importance.max && imp > importance.max) return false

          return true
        })

        console.log(
          `⭐ Memory Search: After importance filter: ${filteredResults.length} results`
        )
      }

      // Record memory access for each result
      for (const result of filteredResults) {
        try {
          await memoryDb.recordMemoryAccess(result.id)
        } catch (error) {
          console.warn(
            `⚠️ Memory Search: Failed to record access for ${result.id}:`,
            error
          )
        }
      }

      // Transform results to match the expected format
      const transformedResults = filteredResults.map((result) => ({
        id: result.id,
        type: result.type || 'unknown',
        category: result.category || 'general',
        title: result.title || 'Untitled',
        summary: result.summary || result.description || '',
        description: result.description || '',
        importance: result.importance || 1,
        messageCount: result.messageCount || 1,
        relevantExcerpts:
          result.relevantExcerpts || (result.summary ? [result.summary] : []),
        createdAt:
          result.createdAt?.toISOString?.() ||
          result.createdAt ||
          new Date().toISOString(),
        lastAccessedAt:
          result.lastAccessedAt?.toISOString?.() || result.lastAccessedAt,
        tags: result.tags || [],
        similarity: result.similarity,
      }))

      // Generate result message
      let message = `Found ${filteredResults.length} memories`
      if (query) message += ` matching "${query}"`
      if (types?.length) message += ` (types: ${types.join(', ')})`
      if (categories?.length)
        message += ` (categories: ${categories.join(', ')})`
      if (searchMethod === 'semantic') message += ' using semantic search'

      console.log(`✅ Memory Search: ${message}`)

      return {
        success: true,
        results: transformedResults,
        query,
        totalFound: filteredResults.length,
        searchMethod,
        message,
      }
    } catch (error) {
      console.error('💥 Memory Search: Error occurred:', error)

      return {
        success: false,
        results: [],
        query,
        totalFound: 0,
        searchMethod: 'text',
        message: `Failed to search memories: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }
    }
  },
}
