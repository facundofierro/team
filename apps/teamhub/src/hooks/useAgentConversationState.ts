'use client'

import { useCallback, useEffect } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useReactive } from '@drizzle/reactive/client'
import type { Agent } from '@teamhub/db'

export function useAgentConversationState(agentId: string | null) {
  const {
    updateAgentConversationState,
    getAgentConversationState,
    agentConversationStates,
  } = useAgentStore()

  // Get agent data with conversation state from database
  const { data: agent, isStale } = useReactive<Agent | null>(
    'agents.getWithConversationState',
    { agentId: agentId || '' },
    { enabled: !!agentId }
  )

  // Update local store when database changes
  useEffect(() => {
    if (agent && agentId) {
      const dbState = {
        activeConversationId: agent.activeConversationId || null,
        lastMessages: agent.lastMessages || [],
      }

      const currentState = getAgentConversationState(agentId)

      // Only update if different to avoid unnecessary re-renders
      if (
        currentState?.activeConversationId !== dbState.activeConversationId ||
        JSON.stringify(currentState?.lastMessages) !==
          JSON.stringify(dbState.lastMessages)
      ) {
        updateAgentConversationState(agentId, dbState)
      }
    }
  }, [agent, agentId, updateAgentConversationState, getAgentConversationState])

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
        // Update local store immediately for UI responsiveness
        updateAgentConversationState(agentId, state)

        // Update database via tRPC
        // Note: This will be implemented when we add the tRPC client
        // For now, we'll just update the local store
        console.log(
          '💬 [useAgentConversationState] Updated conversation state:',
          state
        )
      } catch (error) {
        console.error('Failed to update conversation state:', error)
        // Revert local store on error
        const currentState = getAgentConversationState(agentId)
        if (currentState) {
          updateAgentConversationState(agentId, currentState)
        }
      }
    },
    [agentId, updateAgentConversationState, getAgentConversationState]
  )

  // Get current conversation state
  const getCurrentConversationState = useCallback(() => {
    if (!agentId) return null
    return getAgentConversationState(agentId)
  }, [agentId, getAgentConversationState])

  return {
    agent,
    isStale,
    conversationState: getCurrentConversationState(),
    updateConversationState,
    // Quick access to last messages for fast loading
    lastMessages: getCurrentConversationState()?.lastMessages || [],
    activeConversationId:
      getCurrentConversationState()?.activeConversationId || null,
  }
}
