'use client'

import { useReactive, useReactiveQuery } from '@drizzle/reactive/client'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { ConversationMemory } from '@teamhub/db'

/**
 * Hook for reactive conversation queries
 * Provides optimized data fetching with automatic caching and invalidation
 */
export function useConversations(agentId: string | null) {
  const { currentOrganization } = useOrganizationStore()
  const organizationId = currentOrganization?.id

  // Query for active conversation
  const {
    data: activeConversation,
    isLoading: loadingActive,
    error: activeError,
    run: refetchActiveConversation,
  } = useReactiveQuery<ConversationMemory | null, { agentId: string; organizationId: string }>(
    'conversations.getActive'
  )

  // Note: conversations.getRecent is not available in tRPC router yet
  // We'll use server actions as fallback for now
  const recentConversations: ConversationMemory[] = []
  const loadingRecent = false
  const recentError = null

  // Query for single conversation by ID
  const {
    data: conversationById,
    isLoading: loadingById,
    error: byIdError,
    run: loadConversationById,
  } = useReactiveQuery<ConversationMemory | null, { conversationId: string; organizationId: string }>(
    'conversations.getOne'
  )

  // Load active conversation when agent or organization changes
  const loadActiveConversation = async () => {
    if (!agentId || !organizationId) return null
    
    try {
      console.log('🔍 [useConversations] Loading active conversation for agent:', agentId)
      const result = await refetchActiveConversation({ 
        agentId, 
        organizationId 
      })
      console.log('✅ [useConversations] Active conversation loaded:', !!result)
      return result
    } catch (error) {
      console.error('❌ [useConversations] Failed to load active conversation:', error)
      return null
    }
  }

  // Load recent conversations using server action fallback
  const loadRecentConversations = async (limit: number = 10) => {
    if (!agentId || !organizationId) return []
    
    try {
      console.log('🔍 [useConversations] Loading recent conversations for agent (fallback):', agentId)
      // Import server action dynamically to avoid SSR issues
      const { getRecentConversations } = await import('@/lib/actions/conversation')
      // Use the existing organization store
      const orgDatabaseName = currentOrganization?.databaseName || 'teamhub'
      
      const result = await getRecentConversations(agentId, orgDatabaseName, limit)
      console.log('✅ [useConversations] Recent conversations loaded (fallback):', result?.length || 0)
      return result || []
    } catch (error) {
      console.error('❌ [useConversations] Failed to load recent conversations:', error)
      return []
    }
  }

  // Load specific conversation by ID
  const loadConversation = async (conversationId: string) => {
    if (!organizationId) return null
    
    try {
      console.log('🔍 [useConversations] Loading conversation:', conversationId)
      const result = await loadConversationById({ 
        conversationId, 
        organizationId 
      })
      console.log('✅ [useConversations] Conversation loaded:', !!result)
      return result
    } catch (error) {
      console.error('❌ [useConversations] Failed to load conversation:', error)
      return null
    }
  }

  return {
    // Data
    activeConversation,
    recentConversations: recentConversations || [],
    conversationById,
    
    // Loading states
    loadingActive,
    loadingRecent,
    loadingById,
    isLoading: loadingActive || loadingRecent || loadingById,
    
    // Errors
    activeError,
    recentError,
    byIdError,
    error: activeError || recentError || byIdError,
    
    // Actions
    loadActiveConversation,
    loadRecentConversations,
    loadConversation,
    refetchActiveConversation,
    // refetchRecentConversations not available yet
  }
}
