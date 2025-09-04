'use client'

import { useReactive, useReactiveQuery } from '@drizzle/reactive/client'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { ConversationMemory } from '@agelum/db'
import { log } from '@repo/logger'

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
  } = useReactiveQuery<
    ConversationMemory | null,
    { agentId: string; organizationId: string }
  >('conversations.getActive')

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
  } = useReactiveQuery<
    ConversationMemory | null,
    { conversationId: string; organizationId: string }
  >('conversations.getOne')

  // Load active conversation when agent or organization changes
  const loadActiveConversation = async () => {
    if (!agentId || !organizationId) return null

    try {
      log.agelum.chat.debug(
        'Loading active conversation for agent',
        undefined,
        { agentId }
      )
      const result = await refetchActiveConversation({
        agentId,
        organizationId,
      })
      log.agelum.chat.info('Active conversation loaded', undefined, {
        agentId,
        success: !!result,
      })
      return result
    } catch (error) {
      log.agelum.chat.error('Failed to load active conversation', undefined, {
        error,
        agentId,
      })
      return null
    }
  }

  // Load recent conversations using server action fallback
  const loadRecentConversations = async (limit: number = 10) => {
    if (!agentId || !organizationId) return []

    try {
      log.agelum.chat.debug(
        'Loading recent conversations for agent (fallback)',
        undefined,
        { agentId }
      )
      // Import server action dynamically to avoid SSR issues
      const { getRecentConversations } = await import(
        '@/lib/actions/conversation'
      )
      // Use the existing organization store
      const orgDatabaseName = currentOrganization?.databaseName || 'agelum'

      const result = await getRecentConversations(
        agentId,
        orgDatabaseName,
        limit
      )
      log.agelum.chat.info(
        'Recent conversations loaded (fallback)',
        undefined,
        { agentId, count: result?.length || 0 }
      )
      return result || []
    } catch (error) {
      log.agelum.chat.error('Failed to load recent conversations', undefined, {
        error,
        agentId,
      })
      return []
    }
  }

  // Load specific conversation by ID
  const loadConversation = async (conversationId: string) => {
    if (!organizationId) return null

    try {
      log.agelum.chat.debug('Loading conversation', undefined, {
        conversationId,
      })
      const result = await loadConversationById({
        conversationId,
        organizationId,
      })
      log.agelum.chat.info('Conversation loaded', undefined, {
        conversationId,
        success: !!result,
      })
      return result
    } catch (error) {
      log.agelum.chat.error('Failed to load conversation', undefined, {
        error,
        conversationId,
      })
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
