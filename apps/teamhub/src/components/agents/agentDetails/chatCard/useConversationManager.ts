import { useState, useEffect, useCallback } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import type {
  ConversationMemory,
  ConversationMessage,
  ToolCall,
} from '@teamhub/db'
import {
  getActiveConversation,
  getRecentConversations,
  startNewConversation,
  addMessageToConversation,
  completeConversation,
  loadConversationHistory,
  switchToConversation,
} from '@/lib/actions/conversation'

// Types for conversation management - using database types
type Conversation = ConversationMemory

type UseConversationManagerProps = {
  onConversationChange?: (conversation: Conversation | null) => void
}

export function useConversationManager({
  onConversationChange,
}: UseConversationManagerProps = {}) {
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [recentConversations, setRecentConversations] = useState<
    Conversation[]
  >([])
  const selectedAgent = useAgentStore((state) => state.selectedAgent)
  const { currentOrganization } = useOrganizationStore()

  // Get the actual organization database name from the current organization
  const orgDatabaseName = currentOrganization?.databaseName || 'teamhub'

  // Server action wrappers
  const loadActiveConversation = useCallback(async () => {
    if (!selectedAgent?.id) return

    try {
      const activeConversation = await getActiveConversation(
        selectedAgent.id,
        orgDatabaseName
      )
      setCurrentConversation(activeConversation)
      onConversationChange?.(activeConversation)
    } catch (error) {
      console.error('Failed to load active conversation:', error)
    }
  }, [selectedAgent?.id, orgDatabaseName, onConversationChange])

  const loadRecentConversations = useCallback(async () => {
    if (!selectedAgent?.id) return

    try {
      const conversations = await getRecentConversations(
        selectedAgent.id,
        orgDatabaseName,
        10
      )
      setRecentConversations(conversations)
    } catch (error) {
      console.error('Failed to load recent conversations:', error)
    }
  }, [selectedAgent?.id, orgDatabaseName])

  // Load active conversation when agent or organization changes
  useEffect(() => {
    if (!selectedAgent?.id || !currentOrganization?.databaseName) return

    loadActiveConversation()
    loadRecentConversations()
  }, [
    selectedAgent?.id,
    currentOrganization?.databaseName,
    loadActiveConversation,
    loadRecentConversations,
  ])

  const startNewConversationAction = useCallback(
    async (firstMessage: string) => {
      if (!selectedAgent?.id || isCreatingConversation) return null

      setIsCreatingConversation(true)
      try {
        const newConversation = await startNewConversation(
          selectedAgent.id,
          firstMessage,
          orgDatabaseName
        )

        setCurrentConversation(newConversation)
        onConversationChange?.(newConversation)

        return newConversation
      } catch (error) {
        console.error('Failed to start new conversation:', error)
        return null
      } finally {
        setIsCreatingConversation(false)
      }
    },
    [
      selectedAgent?.id,
      isCreatingConversation,
      onConversationChange,
      orgDatabaseName,
    ]
  )

  const addMessageToConversationAction = useCallback(
    async (
      role: 'user' | 'assistant',
      content: string,
      messageId?: string,
      toolCalls?: ToolCall[]
    ) => {
      if (!currentConversation) return null

      try {
        const updatedConversation = await addMessageToConversation(
          currentConversation.id,
          role,
          content,
          orgDatabaseName,
          messageId,
          toolCalls
        )

        if (updatedConversation) {
          setCurrentConversation(updatedConversation)
          onConversationChange?.(updatedConversation)
        }

        return updatedConversation
      } catch (error) {
        console.error('Failed to add message to conversation:', error)
        return null
      }
    },
    [currentConversation, onConversationChange, orgDatabaseName]
  )

  const completeCurrentConversation = useCallback(async () => {
    if (!currentConversation) return

    try {
      await completeConversation(currentConversation.id, orgDatabaseName)

      // Add to recent conversations and clear current
      setRecentConversations((prev) => [currentConversation, ...prev])
      setCurrentConversation(null)
      onConversationChange?.(null)
    } catch (error) {
      console.error('Failed to complete conversation:', error)
    }
  }, [currentConversation, onConversationChange, orgDatabaseName])

  const switchToConversationAction = useCallback(
    async (conversationId: string) => {
      try {
        // Complete current conversation if exists
        if (currentConversation) {
          await completeCurrentConversation()
        }

        // Load the target conversation
        const conversation = await switchToConversation(
          conversationId,
          orgDatabaseName
        )

        if (conversation) {
          setCurrentConversation(conversation as ConversationMemory)
          onConversationChange?.(conversation as ConversationMemory)
        }
      } catch (error) {
        console.error('Failed to switch conversation:', error)
      }
    },
    [
      currentConversation,
      onConversationChange,
      completeCurrentConversation,
      orgDatabaseName,
    ]
  )

  const loadConversationHistoryAction = useCallback(
    async (conversationId: string) => {
      try {
        return await loadConversationHistory(conversationId, orgDatabaseName)
      } catch (error) {
        console.error('Failed to load conversation history:', error)
        return null
      }
    },
    [orgDatabaseName]
  )

  return {
    currentConversation,
    recentConversations,
    isCreatingConversation,
    startNewConversation: startNewConversationAction,
    addMessageToConversation: addMessageToConversationAction,
    completeCurrentConversation,
    switchToConversation: switchToConversationAction,
    loadConversationHistory: loadConversationHistoryAction,
    refreshConversations: loadRecentConversations,
  }
}
