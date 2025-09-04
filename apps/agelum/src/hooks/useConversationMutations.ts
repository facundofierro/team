'use client'

import { useCallback, useState } from 'react'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { ConversationMemory, ToolCall } from '@agelum/db'
import { log } from '@repo/logger'
// Import server actions for fallback
import {
  startNewConversation as startNewConversationAction,
  addMessageToConversation as addMessageAction,
  switchToConversation as switchConversationAction,
  completeConversation as completeConversationAction,
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
  const [isCompletingConversation, setIsCompletingConversation] =
    useState(false)
  const [isUpdatingConversation, setIsUpdatingConversation] = useState(false)

  // Error states
  const [startError, setStartError] = useState<Error | null>(null)
  const [addMessageError, setAddMessageError] = useState<Error | null>(null)
  const [switchError, setSwitchError] = useState<Error | null>(null)
  const [completeError, setCompleteError] = useState<Error | null>(null)
  const [updateError, setUpdateError] = useState<Error | null>(null)

  // Start new conversation using server action
  const startNewConversation = useCallback(
    async (
      input: StartConversationInput
    ): Promise<ConversationMemory | null> => {
      if (!organizationId) {
        log.agelum.chat.error('No organization ID available', undefined, {
          function: 'startNewConversation',
        })
        return null
      }

      setIsStartingConversation(true)
      setStartError(null)

      try {
        log.agelum.chat.info('Starting new conversation for agent', undefined, {
          agentId: input.agentId,
          function: 'startNewConversation',
        })
        const result = await startNewConversationAction(
          input.agentId,
          input.firstMessage,
          orgDatabaseName
        )
        log.agelum.chat.info(
          'New conversation started successfully',
          undefined,
          {
            conversationId: result?.id,
            agentId: input.agentId,
            function: 'startNewConversation',
          }
        )
        return result
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error('Failed to start conversation')
        setStartError(err)
        log.agelum.chat.error('Failed to start conversation', undefined, {
          error: err.message,
          agentId: input.agentId,
          function: 'startNewConversation',
        })
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
        log.agelum.chat.error('No organization ID available', undefined, {
          function: 'addMessageToConversation',
        })
        return null
      }

      setIsAddingMessage(true)
      setAddMessageError(null)

      try {
        log.agelum.chat.info('Adding message to conversation', undefined, {
          conversationId: input.conversationId,
          role: input.role,
          function: 'addMessageToConversation',
        })
        const result = await addMessageAction(
          input.conversationId,
          input.role,
          input.content,
          orgDatabaseName,
          input.messageId,
          input.toolCalls
        )
        log.agelum.chat.info('Message added successfully', undefined, {
          conversationId: input.conversationId,
          function: 'addMessageToConversation',
        })
        return result
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Failed to add message')
        setAddMessageError(err)
        log.agelum.chat.error('Failed to add message', undefined, {
          error: err.message,
          conversationId: input.conversationId,
          function: 'addMessageToConversation',
        })
        return null
      } finally {
        setIsAddingMessage(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Switch to conversation using server action
  const switchToConversation = useCallback(
    async (
      input: SwitchConversationInput
    ): Promise<ConversationMemory | null> => {
      if (!organizationId) {
        log.agelum.chat.error('No organization ID available', undefined, {
          function: 'switchToConversation',
        })
        return null
      }

      setIsSwitchingConversation(true)
      setSwitchError(null)

      try {
        log.agelum.chat.info('Switching to conversation', undefined, {
          conversationId: input.conversationId,
          function: 'switchToConversation',
        })
        const result = await switchConversationAction(
          input.conversationId,
          orgDatabaseName
        )
        log.agelum.chat.info(
          'Switched to conversation successfully',
          undefined,
          {
            conversationId: input.conversationId,
            function: 'switchToConversation',
          }
        )
        return result
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error('Failed to switch conversation')
        setSwitchError(err)
        log.agelum.chat.error('Failed to switch conversation', undefined, {
          error: err.message,
          conversationId: input.conversationId,
          function: 'switchToConversation',
        })
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
        log.agelum.chat.error('No organization ID available', undefined, {
          function: 'completeConversation',
        })
        return false
      }

      setIsCompletingConversation(true)
      setCompleteError(null)

      try {
        log.agelum.chat.info('Completing conversation', undefined, {
          conversationId: input.conversationId,
          shouldGenerateBrief: input.shouldGenerateBrief,
          function: 'completeConversation',
        })
        await completeConversationAction(
          input.conversationId,
          orgDatabaseName,
          input.shouldGenerateBrief || false
        )
        log.agelum.chat.info('Conversation completed successfully', undefined, {
          conversationId: input.conversationId,
          function: 'completeConversation',
        })
        return true
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error('Failed to complete conversation')
        setCompleteError(err)
        log.agelum.chat.error('Failed to complete conversation', undefined, {
          error: err.message,
          conversationId: input.conversationId,
          function: 'completeConversation',
        })
        return false
      } finally {
        setIsCompletingConversation(false)
      }
    },
    [organizationId, orgDatabaseName]
  )

  // Update conversation - not implemented yet, return null
  const updateConversation = useCallback(
    async (
      input: UpdateConversationInput
    ): Promise<ConversationMemory | null> => {
      log.agelum.chat.warn(
        'Update conversation not implemented yet',
        undefined,
        { conversationId: input.conversationId, function: 'updateConversation' }
      )
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
