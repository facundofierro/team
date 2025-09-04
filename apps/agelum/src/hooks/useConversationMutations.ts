'use client'

import { useCallback, useState } from 'react'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { ConversationMemory, ToolCall } from '@agelum/db'
// Import server actions for fallback
import {
  startNewConversation as startNewConversationAction,
  addMessageToConversation as addMessageAction,
  switchToConversation as switchConversationAction,
  completeConversation as completeConversationAction
} from '@/lib/actions/conversation'

interface StartConversationInput {
  agentId: string
  firstMessage: string
}

interface AddMessageInput {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  messageId?: string
  toolCalls?: ToolCall[]
}

interface SwitchConversationInput {
  conversationId: string
}

interface CompleteConversationInput {
  conversationId: string
  shouldGenerateBrief?: boolean
}

interface UpdateConversationInput {
  conversationId: string
  updates: {
    title?: string
    isActive?: boolean
    needsBrief?: boolean
  }
}

/**
 * Hook for conversation mutations
 * Provides reactive mutation operations for conversation CRUD
 */
export function useConversationMutations() {
  const { currentOrganization } = useOrganizationStore()
  const organizationId = currentOrganization?.id
  const orgDatabaseName = currentOrganization?.databaseName || 'agelum'

  // Loading states for manual mutations using server actions
  const [isStartingConversation, setIsStartingConversation] = useState(false)
  const [isAddingMessage, setIsAddingMessage] = useState(false)
  const [isSwitchingConversation, setIsSwitchingConversation] = useState(false)
  const [isCompletingConversation, setIsCompletingConversation] = useState(false)
  const [isUpdatingConversation, setIsUpdatingConversation] = useState(false)

  // Error states
  const [startError, setStartError] = useState<Error | null>(null)
  const [addMessageError, setAddMessageError] = useState<Error | null>(null)
  const [switchError, setSwitchError] = useState<Error | null>(null)
  const [completeError, setCompleteError] = useState<Error | null>(null)
  const [updateError, setUpdateError] = useState<Error | null>(null)

  // Start new conversation using server action
  const startNewConversation = useCallback(
    async (input: StartConversationInput): Promise<ConversationMemory | null> => {
      if (!organizationId) {
        console.error('❌ [useConversationMutations] No organization ID available')
        return null
      }

      setIsStartingConversation(true)
      setStartError(null)
      
      try {
        console.log('🆕 [useConversationMutations] Starting new conversation for agent:', input.agentId)
        const result = await startNewConversationAction(
          input.agentId,
          input.firstMessage,
          orgDatabaseName
        )
        console.log('✅ [useConversationMutations] New conversation started:', result?.id)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to start conversation')
        setStartError(err)
        console.error('❌ [useConversationMutations] Failed to start conversation:', error)
        return null
      } finally {
        setIsStartingConversation(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Add message to conversation using server action
  const addMessageToConversation = useCallback(
    async (input: AddMessageInput): Promise<ConversationMemory | null> => {
      if (!organizationId) {
        console.error('❌ [useConversationMutations] No organization ID available')
        return null
      }

      setIsAddingMessage(true)
      setAddMessageError(null)
      
      try {
        console.log('📝 [useConversationMutations] Adding message to conversation:', input.conversationId)
        const result = await addMessageAction(
          input.conversationId,
          input.role,
          input.content,
          orgDatabaseName,
          input.messageId,
          input.toolCalls
        )
        console.log('✅ [useConversationMutations] Message added successfully')
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to add message')
        setAddMessageError(err)
        console.error('❌ [useConversationMutations] Failed to add message:', error)
        return null
      } finally {
        setIsAddingMessage(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Switch to conversation using server action
  const switchToConversation = useCallback(
    async (input: SwitchConversationInput): Promise<ConversationMemory | null> => {
      if (!organizationId) {
        console.error('❌ [useConversationMutations] No organization ID available')
        return null
      }

      setIsSwitchingConversation(true)
      setSwitchError(null)
      
      try {
        console.log('🔄 [useConversationMutations] Switching to conversation:', input.conversationId)
        const result = await switchConversationAction(
          input.conversationId,
          orgDatabaseName
        )
        console.log('✅ [useConversationMutations] Switched to conversation successfully')
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to switch conversation')
        setSwitchError(err)
        console.error('❌ [useConversationMutations] Failed to switch conversation:', error)
        return null
      } finally {
        setIsSwitchingConversation(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Complete conversation using server action
  const completeConversation = useCallback(
    async (input: CompleteConversationInput): Promise<boolean> => {
      if (!organizationId) {
        console.error('❌ [useConversationMutations] No organization ID available')
        return false
      }

      setIsCompletingConversation(true)
      setCompleteError(null)
      
      try {
        console.log('✅ [useConversationMutations] Completing conversation:', input.conversationId)
        await completeConversationAction(
          input.conversationId,
          orgDatabaseName,
          input.shouldGenerateBrief || false
        )
        console.log('✅ [useConversationMutations] Conversation completed successfully')
        return true
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to complete conversation')
        setCompleteError(err)
        console.error('❌ [useConversationMutations] Failed to complete conversation:', error)
        return false
      } finally {
        setIsCompletingConversation(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Update conversation - not implemented yet, return null
  const updateConversation = useCallback(
    async (input: UpdateConversationInput): Promise<ConversationMemory | null> => {
      console.warn('📝 [useConversationMutations] Update conversation not implemented yet')
      return null
    },
    []
  )

  return {
    // Mutations
    startNewConversation,
    addMessageToConversation,
    switchToConversation,
    completeConversation,
    updateConversation,

    // Loading states
    isStartingConversation,
    isAddingMessage,
    isSwitchingConversation,
    isCompletingConversation,
    isUpdatingConversation,
    
    // Combined loading state
    isLoading: 
      isStartingConversation ||
      isAddingMessage ||
      isSwitchingConversation ||
      isCompletingConversation ||
      isUpdatingConversation,

    // Errors
    startError,
    addMessageError,
    switchError,
    completeError,
    updateError,
    
    // Combined error
    error: 
      startError ||
      addMessageError ||
      switchError ||
      completeError ||
      updateError,

    // Success states (simple approach)
    startSuccess: !isStartingConversation && !startError,
    addMessageSuccess: !isAddingMessage && !addMessageError,
    switchSuccess: !isSwitchingConversation && !switchError,
    completeSuccess: !isCompletingConversation && !completeError,
    updateSuccess: !isUpdatingConversation && !updateError,

    // Reset functions
    resetStart: () => setStartError(null),
    resetAddMessage: () => setAddMessageError(null),
    resetSwitch: () => setSwitchError(null),
    resetComplete: () => setCompleteError(null),
    resetUpdate: () => setUpdateError(null),
  }
}
