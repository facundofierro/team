import { useState, useEffect, useCallback } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import { useAgentConversationState } from '@/hooks/useAgentConversationState'
import { useReactive, useReactiveQuery } from '@drizzle/reactive/client'
import type {
  ConversationMemory,
  ConversationMessage,
  ToolCall,
  Agent,
} from '@teamhub/db'
import {
  getActiveConversation,
  getRecentConversations,
  startNewConversation,
  addMessageToConversation,
  completeConversation,
  loadConversationHistory,
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
  
  // Get selected agent ID from simplified store
  const selectedAgentId = useAgentStore((state) => state.selectedAgentId)
  
  // Get selected agent data from reactive cache
  const { data: selectedAgent } = useReactive<Agent | null>(
    'agents.getOne',
    { id: selectedAgentId || '' },
    { enabled: !!selectedAgentId }
  )
  
  const { currentOrganization } = useOrganizationStore()

  // Get the actual organization database name from the current organization
  const orgDatabaseName = currentOrganization?.databaseName || 'teamhub'

  // Use the new conversation state management hook
  const {
    conversationState,
    updateConversationState,
    clearConversationState,
    lastMessages,
    activeConversationId,
  } = useAgentConversationState(selectedAgent?.id || null)

  const [previousAgentId, setPreviousAgentId] = useState<string | null>(null)

  // Reset conversation state when agent changes (but not on initial load)
  useEffect(() => {
    if (selectedAgent?.id && previousAgentId && selectedAgent.id !== previousAgentId) {
      console.log(
        '💬 [useConversationManager] Agent changed, resetting conversation state'
      )
      setCurrentConversation(null)
      setRecentConversations([])
      setIsCreatingConversation(false)
      onConversationChange?.(null)
    }
    setPreviousAgentId(selectedAgent?.id || null)
  }, [selectedAgent?.id, previousAgentId, onConversationChange])

  // Server action wrappers
  const loadActiveConversation = useCallback(async () => {
    if (!selectedAgent?.id) return

    try {
      // First, check if we have a stored active conversation ID
      if (activeConversationId) {
        console.log(
          '💬 [useConversationManager] Loading stored conversation:',
          activeConversationId
        )

        // Try to load the stored conversation
        const storedConversation = await getActiveConversation(
          selectedAgent.id,
          orgDatabaseName
        )

        if (
          storedConversation &&
          storedConversation.id === activeConversationId
        ) {
          setCurrentConversation(storedConversation)
          onConversationChange?.(storedConversation)
          return
        }
      }

      // Fallback: load any active conversation
      const activeConversation = await getActiveConversation(
        selectedAgent.id,
        orgDatabaseName
      )

      if (activeConversation) {
        setCurrentConversation(activeConversation)
        onConversationChange?.(activeConversation)

        // Re-enabled: Update the stored conversation state (infinite loop is fixed)
        updateConversationState({
          activeConversationId: activeConversation.id,
          lastMessages:
            activeConversation.content
              ?.filter((msg) => msg.role === 'user' || msg.role === 'assistant')
              .slice(-2)
              .map((msg) => ({
                id: msg.id,
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
                timestamp: msg.timestamp,
              })) || [],
        })
      }
    } catch (error) {
      console.error('Failed to load active conversation:', error)
    }
  }, [
    selectedAgent?.id,
    orgDatabaseName,
    onConversationChange,
    activeConversationId,
    updateConversationState,
  ])

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

    // Always clear current conversation when switching agents (even if it's the same agent)
    // This ensures proper loading of conversation state
    console.log('🔄 [useConversationManager] Loading conversation for agent:', selectedAgent.id)
    setCurrentConversation(null)
    onConversationChange?.(null)

    loadActiveConversation()
    loadRecentConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedAgent?.id,
    currentOrganization?.databaseName,
    onConversationChange,
    // Removed loadActiveConversation and loadRecentConversations from dependencies
    // to prevent infinite loop - these functions are stable and don't need to be in deps
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

          // Re-enabled: Update the stored conversation state with last 2 messages (infinite loop is fixed)
          updateConversationState({
            activeConversationId: updatedConversation.id,
            lastMessages:
              updatedConversation.content
                ?.filter(
                  (msg) => msg.role === 'user' || msg.role === 'assistant'
                )
                .slice(-2)
                .map((msg) => ({
                  id: msg.id,
                  role: msg.role as 'user' | 'assistant',
                  content: msg.content,
                  timestamp: msg.timestamp,
                })) || [],
          })
        }

        return updatedConversation
      } catch (error) {
        console.error('Failed to add message to conversation:', error)
        return null
      }
    },
    [
      currentConversation,
      onConversationChange,
      orgDatabaseName,
      updateConversationState,
    ]
  )

  const completeCurrentConversation = useCallback(async () => {
    if (!currentConversation) return

    try {
      // Only generate brief if conversation has meaningful content (more than 2 messages)
      const shouldGenerateBrief = Boolean(
        currentConversation.messageCount && currentConversation.messageCount > 2
      )

      await completeConversation(
        currentConversation.id,
        orgDatabaseName,
        shouldGenerateBrief
      )

      // Add to recent conversations and clear current
      setRecentConversations((prev) => [currentConversation, ...prev])
      setCurrentConversation(null)
      onConversationChange?.(null)

      // Re-enabled: Clear the stored conversation state (infinite loop is fixed)
      if (selectedAgent?.id) {
        updateConversationState({
          activeConversationId: null,
          lastMessages: [],
        })
      }
    } catch (error) {
      console.error('Failed to complete conversation:', error)
    }
  }, [
    currentConversation,
    onConversationChange,
    orgDatabaseName,
    selectedAgent?.id,
    updateConversationState,
  ])

  // Reactive conversation loading hook with dynamic parameters
  const {
    data: loadedConversation,
    isLoading: loadingConversation,
    error: conversationError,
    run: loadConversationMemory,
  } = useReactiveQuery<ConversationMemory | null, { conversationId: string; organizationId: string }>(
    'conversations.getOne'
  )

  const switchToConversationAction = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !currentOrganization?.id) {
        console.error('Missing conversationId or organization')
        return
      }

      try {
        console.log('🔄 [useConversationManager] Switching to conversation:', conversationId)

        // Complete current conversation if exists
        if (currentConversation) {
          await completeCurrentConversation()
        }

        // Load the target conversation using reactive function
        const conversation = await loadConversationMemory({
          conversationId,
          organizationId: currentOrganization.id,
        })

        console.log('💬 [useConversationManager] Loaded conversation:', {
          id: conversation?.id,
          hasContent: !!conversation?.content,
          messageCount: Array.isArray(conversation?.content) ? conversation.content.length : 0,
        })

        if (conversation) {
          setCurrentConversation(conversation)
          onConversationChange?.(conversation)

          // Update the stored conversation state with message content
          if (selectedAgent?.id) {
            const conversationMessages = Array.isArray(conversation.content) ? conversation.content : []
            
            updateConversationState({
              activeConversationId: conversation.id,
              lastMessages:
                conversationMessages
                  .filter(
                    (msg) => msg.role === 'user' || msg.role === 'assistant'
                  )
                  .slice(-2)
                  .map((msg) => ({
                    id: msg.id,
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                    timestamp: msg.timestamp,
                  })),
            })
          }

          console.log('✅ [useConversationManager] Conversation switch completed successfully')
        } else {
          console.warn('⚠️ [useConversationManager] No conversation found for ID:', conversationId)
        }
      } catch (error) {
        console.error('❌ [useConversationManager] Failed to switch conversation:', error)
      }
    },
    [
      currentConversation,
      onConversationChange,
      completeCurrentConversation,
      currentOrganization?.id,
      selectedAgent?.id,
      updateConversationState,
      loadConversationMemory,
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

  // Load full conversation after showing quick messages
  const loadFullConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return

      try {
        console.log('🔄 Loading full conversation:', conversationId)

        // Load the full conversation history
        const fullConversation = await loadConversationHistory(
          conversationId,
          orgDatabaseName
        )

        if (fullConversation) {
          setCurrentConversation(fullConversation)
          onConversationChange?.(fullConversation)
          console.log(
            '✅ Full conversation loaded:',
            fullConversation.content?.length,
            'messages'
          )
        }
      } catch (error) {
        console.error('Failed to load full conversation:', error)
      }
    },
    [orgDatabaseName, onConversationChange]
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
    loadFullConversation,
    refreshConversations: loadRecentConversations,
    clearConversationState, // For debugging corrupted state
    // Quick access to stored conversation state
    lastMessages,
    activeConversationId,
    conversationState,
  }
}
