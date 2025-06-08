import { eq, and, sql, inArray, desc, like } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { memory } from './schema'
import type {
  Memory,
  NewMemory,
  MemoryWithTypes,
  ConversationMemory,
  FactMemory,
  PreferenceMemory,
  SkillMemory,
  MemorySummary,
  MemorySearchResult,
  CreateConversationMemory,
  CreateFactMemory,
  CreatePreferenceMemory,
  CreateSkillMemory,
  MemoryContent,
  ConversationMessage,
} from './types'
import * as schema from './schema'

export const getFunctions = (database: NodePgDatabase<typeof schema>) => {
  // Base columns that always exist
  const baseColumns = {
    id: memory.id,
    agentId: memory.agentId,
    agentCloneId: memory.agentCloneId,
    type: memory.type,
    category: memory.category,
    title: memory.title,
    content: memory.content,
    summary: memory.summary,
    description: memory.description,
    keyTopics: memory.keyTopics,
    tags: memory.tags,
    importance: memory.importance,
    messageCount: memory.messageCount,
    participantIds: memory.participantIds,
    isActive: memory.isActive,
    needsBrief: memory.needsBrief,
    accessCount: memory.accessCount,
    lastAccessedAt: memory.lastAccessedAt,
    status: memory.status,
    createdAt: memory.createdAt,
    updatedAt: memory.updatedAt,
    expiresAt: memory.expiresAt,
  }

  const transformMemory = (result: any): MemoryWithTypes => ({
    ...result,
    content: result.content as MemoryContent,
    keyTopics: (result.keyTopics as string[]) || [],
    tags: (result.tags as string[]) || [],
    participantIds: (result.participantIds as string[]) || [],
    embedding: (result.embedding as number[]) || [],
  })

  return {
    // Generic memory functions
    createMemory: async (data: NewMemory): Promise<MemoryWithTypes> => {
      const [result] = await database.insert(memory).values(data).returning()
      return transformMemory(result)
    },

    getMemory: async (id: string): Promise<MemoryWithTypes | null> => {
      const [result] = await database
        .select(baseColumns)
        .from(memory)
        .where(eq(memory.id, id))

      return result ? transformMemory(result) : null
    },

    updateMemory: async (
      id: string,
      updates: Partial<NewMemory>
    ): Promise<MemoryWithTypes | null> => {
      const [result] = await database
        .update(memory)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(memory.id, id))
        .returning()

      return result ? transformMemory(result) : null
    },

    deleteMemory: async (id: string): Promise<void> => {
      await database
        .update(memory)
        .set({ status: 'deleted' })
        .where(eq(memory.id, id))
    },

    // Conversation-specific functions
    createConversation: async (
      data: CreateConversationMemory
    ): Promise<ConversationMemory> => {
      const memoryData: NewMemory = {
        ...data,
        type: 'conversation',
        messageCount: data.messageCount || data.content.length,
      }
      const [result] = await database
        .insert(memory)
        .values(memoryData)
        .returning()
      return transformMemory(result) as ConversationMemory
    },

    // NEW: Create conversation and set as active
    startNewConversation: async (
      agentId: string,
      agentCloneId: string | null,
      userId: string,
      firstMessage: string
    ): Promise<ConversationMemory> => {
      // First, mark any existing active conversation as inactive and needing brief
      await database
        .update(memory)
        .set({
          isActive: false,
          needsBrief: true,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(memory.agentId, agentId),
            eq(memory.type, 'conversation'),
            eq(memory.isActive, true)
          )
        )

      // Generate title from first message (placeholder - integrate with AI later)
      const title =
        firstMessage.length > 50
          ? firstMessage.substring(0, 47) + '...'
          : firstMessage

      // Create new active conversation
      const conversationData: NewMemory = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        agentId,
        agentCloneId,
        type: 'conversation',
        category: 'chat',
        title,
        content: [], // Start empty, will be populated with first response
        description: 'Active chat conversation',
        participantIds: [userId, agentId],
        importance: 5,
        messageCount: 0,
        isActive: true,
        needsBrief: false, // New conversation doesn't need brief yet
      }

      const [result] = await database
        .insert(memory)
        .values(conversationData)
        .returning()
      return transformMemory(result) as ConversationMemory
    },

    // NEW: Get active conversation for agent
    getActiveConversation: async (
      agentId: string,
      agentCloneId?: string
    ): Promise<ConversationMemory | null> => {
      const conditions = [
        eq(memory.agentId, agentId),
        eq(memory.type, 'conversation'),
        eq(memory.isActive, true),
        eq(memory.status, 'active'),
      ]

      if (agentCloneId) {
        conditions.push(eq(memory.agentCloneId, agentCloneId))
      }

      const [result] = await database
        .select(baseColumns)
        .from(memory)
        .where(and(...conditions))
        .limit(1)

      return result ? (transformMemory(result) as ConversationMemory) : null
    },

    // NEW: Add message to active conversation
    addMessageToConversation: async (
      conversationId: string,
      role: 'user' | 'assistant',
      content: string,
      messageId?: string
    ): Promise<ConversationMemory | null> => {
      const conversation = await database
        .select(baseColumns)
        .from(memory)
        .where(eq(memory.id, conversationId))
        .limit(1)

      if (!conversation[0]) return null

      const currentMessages =
        (conversation[0].content as ConversationMessage[]) || []
      const newMessage: ConversationMessage = {
        id:
          messageId ||
          `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        role,
        content,
        timestamp: new Date().toISOString(),
      }

      const updatedMessages = [...currentMessages, newMessage]

      const [result] = await database
        .update(memory)
        .set({
          content: updatedMessages,
          messageCount: updatedMessages.length,
          updatedAt: new Date(),
        })
        .where(eq(memory.id, conversationId))
        .returning()

      return result ? (transformMemory(result) as ConversationMemory) : null
    },

    // NEW: Complete conversation and mark for brief generation
    completeConversation: async (conversationId: string): Promise<void> => {
      await database
        .update(memory)
        .set({
          isActive: false,
          needsBrief: true,
          updatedAt: new Date(),
        })
        .where(eq(memory.id, conversationId))
    },

    // NEW: Get conversations that need brief generation
    getConversationsNeedingBrief: async (
      agentId: string,
      limit: number = 10
    ): Promise<ConversationMemory[]> => {
      const results = await database
        .select(baseColumns)
        .from(memory)
        .where(
          and(
            eq(memory.agentId, agentId),
            eq(memory.type, 'conversation'),
            eq(memory.needsBrief, true),
            eq(memory.status, 'active')
          )
        )
        .orderBy(desc(memory.updatedAt))
        .limit(limit)

      return results.map(
        (result) => transformMemory(result) as ConversationMemory
      )
    },

    // NEW: Update conversation with AI-generated summary
    updateConversationBrief: async (
      conversationId: string,
      summary: string,
      description?: string,
      keyTopics?: string[]
    ): Promise<ConversationMemory | null> => {
      const updates: Partial<NewMemory> = {
        summary,
        needsBrief: false,
        updatedAt: new Date(),
      }

      if (description) updates.description = description
      if (keyTopics) updates.keyTopics = keyTopics

      const [result] = await database
        .update(memory)
        .set(updates)
        .where(eq(memory.id, conversationId))
        .returning()

      return result ? (transformMemory(result) as ConversationMemory) : null
    },

    // Updated updateConversation function
    updateConversation: async (
      id: string,
      messages: MemoryContent,
      summary?: string,
      keyTopics?: string[]
    ): Promise<ConversationMemory | null> => {
      const updates: Partial<NewMemory> = {
        content: messages,
        messageCount: Array.isArray(messages) ? messages.length : 1,
        updatedAt: new Date(),
      }

      if (summary) updates.summary = summary
      if (keyTopics) updates.keyTopics = keyTopics

      const [result] = await database
        .update(memory)
        .set(updates)
        .where(and(eq(memory.id, id), eq(memory.type, 'conversation')))
        .returning()

      return result ? (transformMemory(result) as ConversationMemory) : null
    },

    // Fact-specific functions
    createFact: async (data: CreateFactMemory): Promise<FactMemory> => {
      const memoryData: NewMemory = {
        ...data,
        type: 'fact',
        messageCount: 1,
      }
      const [result] = await database
        .insert(memory)
        .values(memoryData)
        .returning()
      return transformMemory(result) as FactMemory
    },

    // Preference-specific functions
    createPreference: async (
      data: CreatePreferenceMemory
    ): Promise<PreferenceMemory> => {
      const memoryData: NewMemory = {
        ...data,
        type: 'preference',
        messageCount: 1,
      }
      const [result] = await database
        .insert(memory)
        .values(memoryData)
        .returning()
      return transformMemory(result) as PreferenceMemory
    },

    // Skill-specific functions
    createSkill: async (data: CreateSkillMemory): Promise<SkillMemory> => {
      const memoryData: NewMemory = {
        ...data,
        type: 'skill',
        messageCount: 1,
      }
      const [result] = await database
        .insert(memory)
        .values(memoryData)
        .returning()
      return transformMemory(result) as SkillMemory
    },

    // Query functions
    getAgentMemories: async (
      agentId: string,
      options: {
        agentCloneId?: string
        types?: string[]
        categories?: string[]
        status?: string
        limit?: number
        orderBy?: 'importance' | 'recent' | 'accessed'
      } = {}
    ): Promise<MemoryWithTypes[]> => {
      const {
        agentCloneId,
        types,
        categories,
        status = 'active',
        limit = 50,
        orderBy = 'importance',
      } = options

      const conditions = [
        eq(memory.agentId, agentId),
        eq(memory.status, status),
      ]

      if (agentCloneId) {
        conditions.push(eq(memory.agentCloneId, agentCloneId))
      }
      if (types?.length) {
        conditions.push(inArray(memory.type, types))
      }
      if (categories?.length) {
        conditions.push(inArray(memory.category, categories))
      }

      let orderByClause
      switch (orderBy) {
        case 'recent':
          orderByClause = desc(memory.createdAt)
          break
        case 'accessed':
          orderByClause = desc(memory.lastAccessedAt)
          break
        default:
          orderByClause = desc(memory.importance)
      }

      const results = await database
        .select(baseColumns)
        .from(memory)
        .where(and(...conditions))
        .orderBy(orderByClause, desc(memory.createdAt))
        .limit(limit)

      return results.map(transformMemory)
    },

    getConversations: async (
      agentId: string,
      agentCloneId?: string,
      limit: number = 20
    ): Promise<ConversationMemory[]> => {
      const conditions = [
        eq(memory.agentId, agentId),
        eq(memory.type, 'conversation'),
        eq(memory.status, 'active'),
      ]

      if (agentCloneId) {
        conditions.push(eq(memory.agentCloneId, agentCloneId))
      }

      const results = await database
        .select(baseColumns)
        .from(memory)
        .where(and(...conditions))
        .orderBy(desc(memory.createdAt))
        .limit(limit)

      return results.map(
        (result) => transformMemory(result) as ConversationMemory
      )
    },

    // Search functions
    searchMemories: async (
      agentId: string,
      query: string,
      options: {
        types?: string[]
        categories?: string[]
        limit?: number
      } = {}
    ): Promise<MemorySummary[]> => {
      const { types, categories, limit = 10 } = options

      const conditions = [
        eq(memory.agentId, agentId),
        eq(memory.status, 'active'),
        like(memory.title, `%${query}%`),
      ]

      if (types?.length) {
        conditions.push(inArray(memory.type, types))
      }
      if (categories?.length) {
        conditions.push(inArray(memory.category, categories))
      }

      const results = await database
        .select({
          id: memory.id,
          type: memory.type,
          category: memory.category,
          title: memory.title,
          description: memory.description,
          summary: memory.summary,
          importance: memory.importance,
          messageCount: memory.messageCount,
          lastAccessedAt: memory.lastAccessedAt,
          createdAt: memory.createdAt,
          tags: memory.tags,
        })
        .from(memory)
        .where(and(...conditions))
        .orderBy(desc(memory.importance), desc(memory.createdAt))
        .limit(limit)

      return results.map((result) => ({
        ...result,
        type: result.type || 'unknown',
        category: result.category || 'general',
        title: result.title || 'Untitled',
        description: result.description || '',
        summary: result.summary || '',
        importance: result.importance || 1,
        messageCount: result.messageCount || 1,
        createdAt: result.createdAt || new Date(),
        tags: (result.tags as string[]) || [],
      }))
    },

    // Vector similarity search (disabled when pgvector not available)
    searchSimilarMemories: async (
      agentId: string,
      embedding: number[],
      options: {
        types?: string[]
        categories?: string[]
        limit?: number
        threshold?: number
      } = {}
    ): Promise<MemorySearchResult[]> => {
      // TODO: Check if embedding column exists before running this query
      // For now, return empty results when pgvector is not available
      console.warn(
        'Vector similarity search is not available - pgvector extension required'
      )
      return []

      /* Original implementation - requires pgvector:
      const { types, categories, limit = 5 } = options

      const conditions = [
        eq(memory.agentId, agentId),
        eq(memory.status, 'active'),
      ]

      if (types?.length) {
        conditions.push(inArray(memory.type, types))
      }
      if (categories?.length) {
        conditions.push(inArray(memory.category, categories))
      }

      const results = await database
        .select({
          id: memory.id,
          type: memory.type,
          category: memory.category,
          title: memory.title,
          description: memory.description,
          summary: memory.summary,
          importance: memory.importance,
          messageCount: memory.messageCount,
          lastAccessedAt: memory.lastAccessedAt,
          createdAt: memory.createdAt,
          tags: memory.tags,
          similarity: sql<number>`1 - (${memory.embedding} <=> ${embedding}::float[])`,
        })
        .from(memory)
        .where(and(...conditions))
        .orderBy(sql`${memory.embedding} <=> ${embedding}::float[]`)
        .limit(limit)

      return results.map((result) => ({
        id: result.id,
        type: result.type || 'unknown',
        category: result.category || 'general',
        title: result.title || 'Untitled',
        description: result.description || '',
        summary: result.summary || '',
        importance: result.importance || 1,
        messageCount: result.messageCount || 1,
        lastAccessedAt: result.lastAccessedAt,
        createdAt: result.createdAt || new Date(),
        tags: (result.tags as string[]) || [],
        similarity: result.similarity || 0,
        relevantExcerpts: result.summary ? [result.summary] : [],
      }))
      */
    },

    // Utility functions
    recordMemoryAccess: async (memoryId: string): Promise<void> => {
      await database
        .update(memory)
        .set({
          accessCount: sql`${memory.accessCount} + 1`,
          lastAccessedAt: new Date(),
        })
        .where(eq(memory.id, memoryId))
    },

    archiveMemory: async (id: string): Promise<void> => {
      await database
        .update(memory)
        .set({ status: 'archived' })
        .where(eq(memory.id, id))
    },

    getMemoryStats: async (
      agentId: string
    ): Promise<{
      total: number
      byType: Record<string, number>
      byCategory: Record<string, number>
    }> => {
      const results = await database
        .select({
          type: memory.type,
          category: memory.category,
          count: sql<number>`count(*)`,
        })
        .from(memory)
        .where(and(eq(memory.agentId, agentId), eq(memory.status, 'active')))
        .groupBy(memory.type, memory.category)

      const byType: Record<string, number> = {}
      const byCategory: Record<string, number> = {}
      let total = 0

      results.forEach((result) => {
        const count = Number(result.count)
        total += count
        byType[result.type || 'unknown'] =
          (byType[result.type || 'unknown'] || 0) + count
        byCategory[result.category || 'general'] =
          (byCategory[result.category || 'general'] || 0) + count
      })

      return { total, byType, byCategory }
    },
  }
}
