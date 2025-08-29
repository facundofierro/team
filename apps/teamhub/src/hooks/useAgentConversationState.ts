'use client'

import { useCallback, useEffect } from 'react'
import { useReactive } from '@drizzle/reactive/client'
import { useReactiveMutation } from './useReactiveMutation'
import type { Agent } from '@teamhub/db'

export function useAgentConversationState(agentId: string | null) {
  // Get agent data with conversation state from database
  const { data: agent, isStale } = useReactive<Agent | null>(
    'agents.getWithConversationState',
    { agentId: agentId || '' },
    { enabled: !!agentId }
  )

  // Create mutation hook for updating conversation state
  const { mutateAsync: updateConversationStateMutation } = useReactiveMutation(
    'agents.updateConversationState'
  )

  // Function to update conversation state in database
  const updateConversationState = useCallback(
    async (state: {
      activeConversationId: string | null
      lastMessages: Array<{
        id: string
        role: 'user' | 'assistant'
        content: string
        timestamp: string
      }>
    }) => {
      if (!agentId) return

      try {
        console.log(
          '💾 [useAgentConversationState] Updating database conversation state:',
          {
            agentId,
            activeConversationId: state.activeConversationId,
            lastMessagesCount: state.lastMessages.length,
          }
        )

        // Use reactive mutation hook
        await updateConversationStateMutation({
          agentId,
          activeConversationId: state.activeConversationId,
          lastMessages: state.lastMessages,
        })

      } catch (error) {
        console.error('❌ [useAgentConversationState] Database update failed:', error)
      }
    },
    [agentId, updateConversationStateMutation]
  )

  // Function to clear conversation state (for debugging)
  const clearConversationState = useCallback(async () => {
    if (!agentId) return
    
    try {
      console.log('🧹 [useAgentConversationState] Clearing conversation state for agent:', agentId)
      
      await updateConversationState({
        activeConversationId: null,
        lastMessages: [],
      })
      
      console.log('✅ [useAgentConversationState] Successfully cleared conversation state for agent:', agentId)
    } catch (error) {
      console.error('❌ [useAgentConversationState] Failed to clear conversation state:', error)
    }
  }, [agentId, updateConversationState])

  return {
    agent,
    isStale,
    // All conversation state comes directly from reactive cache
    conversationState: agent ? {
      activeConversationId: agent.activeConversationId || null,
      lastMessages: agent.lastMessages || [],
    } : null,
    updateConversationState,
    clearConversationState,
    // Quick access properties
    lastMessages: agent?.lastMessages || [],
    activeConversationId: agent?.activeConversationId || null,
  }
}
