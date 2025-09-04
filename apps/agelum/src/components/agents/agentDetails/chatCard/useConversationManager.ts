import { useState, useEffect, useCallback } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import { useAgentConversationState } from '@/hooks/useAgentConversationState'
import { useReactive } from '@drizzle/reactive/client'
import type {
  ConversationMemory,
  ConversationMessage,
  ToolCall,
  Agent,
} from '@agelum/db'
// Import the new reactive hooks
import { useConversations } from '@/hooks/useConversations'
import { useConversationMutations } from '@/hooks/useConversationMutations'

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

  // Initialize reactive hooks for conversations
  const { 
    activeConversation: reactiveActiveConversation,
    recentConversations: reactiveRecentConversations,
    loadActiveConversation: fetchActiveConversation,
    loadRecentConversations: fetchRecentConversations,
    loadConversation: fetchConversationById
  } = useConversations(selectedAgent?.id || null)
  
  // Initialize reactive hooks for conversation mutations
  const {
    startNewConversation: startNewConversationMutation,
    addMessageToConversation: addMessageMutation,
    switchToConversation: switchConversationMutation,
    completeConversation: completeConversationMutation
  } = useConversationMutations()

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

  // Reactive data loading functions with server actions as fallback
  const loadActiveConversation = useCallback(async () => {
    if (!selectedAgent?.id) return

    try {
      // First, check if we have a stored active conversation ID
      if (activeConversationId) {
        console.log(
          '💬 [useConversationManager] Loading stored conversation:',
          activeConversationId
        )

        // Try to load the stored conversation with the reactive hook
        const storedConversation = await fetchConversationById(activeConversationId)

        if (
          storedConversation &&
          storedConversation.id === activeConversationId
        ) {
          setCurrentConversation(storedConversation)
          onConversationChange?.(storedConversation)
          return
        }
      }

      // Fallback: load any active conversation using reactive hook
      console.log('🔍 [useConversationManager] No stored activeConversationId, loading active conversation')
      const activeConversation = await fetchActiveConversation()

      console.log('🔍 [useConversationManager] Reactive hook returned active conversation:', {
        found: !!activeConversation,
        id: activeConversation?.id,
        title: activeConversation?.title,
        messageCount: activeConversation?.messageCount,
        isActive: activeConversation?.isActive,
        createdAt: activeConversation?.createdAt
      })

      if (activeConversation) {
        setCurrentConversation(activeConversation)
        onConversationChange?.(activeConversation)

        // Update the stored conversation state (infinite loop is fixed)
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
      } else {
        console.log('⚠️ [useConversationManager] No active conversation found for agent')
      }
    } catch (error) {
      console.error('Failed to load active conversation:', error)
    }
  }, [
    selectedAgent?.id,
    onConversationChange,
    activeConversationId,
    updateConversationState,
    fetchActiveConversation,
    fetchConversationById
  ])

  const loadRecentConversations = useCallback(async () => {
    if (!selectedAgent?.id) return

    try {
      // Use the reactive hook to fetch recent conversations
      const conversations = await fetchRecentConversations(10)
      setRecentConversations(conversations)
    } catch (error) {
      console.error('Failed to load recent conversations:', error)
    }
  }, [selectedAgent?.id, fetchRecentConversations])

  // Load active conversation when agent or organization changes
  useEffect(() => {
    if (!selectedAgent?.id || !currentOrganization?.databaseName) return

    // Always clear current conversation when switching agents (even if it's the same agent)
    // This ensures proper loading of conversation state
    console.log('🔄 [useConversationManager] Loading conversation for agent:', selectedAgent.id)
    console.log('🔄 [useConversationManager] Current activeConversationId:', activeConversationId)
    console.log('🔄 [useConversationManager] Last messages count:', lastMessages.length)
    
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
        // Use reactive mutation to start a new conversation
        const newConversation = await startNewConversationMutation({
          agentId: selectedAgent.id,
          firstMessage
        })

        if (newConversation) {
          setCurrentConversation(newConversation)
          onConversationChange?.(newConversation)
        }

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
      startNewConversationMutation,
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
        // Use reactive mutation to add a message
        const updatedConversation = await addMessageMutation({
          conversationId: currentConversation.id,
          role,
          content,
          messageId,
          toolCalls
        })

        if (updatedConversation) {
          setCurrentConversation(updatedConversation)
          onConversationChange?.(updatedConversation)

          // Update the stored conversation state with last 2 messages
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
      updateConversationState,
      addMessageMutation
    ]
  )

  const completeCurrentConversation = useCallback(async () => {
    if (!currentConversation) return

    try {
      // Only generate brief if conversation has meaningful content (more than 2 messages)
      const shouldGenerateBrief = Boolean(
        currentConversation.messageCount && currentConversation.messageCount > 2
      )

      // Use reactive mutation to complete the conversation
      await completeConversationMutation({
        conversationId: currentConversation.id,
        shouldGenerateBrief
      })

      // Add to recent conversations and clear current
      setRecentConversations((prev) => [currentConversation, ...prev])
      setCurrentConversation(null)
      onConversationChange?.(null)

      // Clear the stored conversation state
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
    selectedAgent?.id,
    updateConversationState,
    completeConversationMutation
  ])

  // This hook is now replaced by the reactive fetchConversationById from useConversations

  const switchToConversationAction = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !currentOrganization?.id) {
        console.error('Missing conversationId or organization')
        return
      }

      try {
        console.log('🔄 Switching conversation:', conversationId.substring(0, 12) + '...')

        // Complete current conversation if exists
        if (currentConversation) {
          await completeCurrentConversation()
        }

        // Use the reactive mutation to switch to the conversation and mark it as active
        const conversation = await switchConversationMutation({
          conversationId
        })

        console.log('💬 Loaded:', conversation?.content?.length + ' msgs')

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
      switchConversationMutation,
    ]
  )

  const loadConversationHistoryAction = useCallback(
    async (conversationId: string) => {
      try {
        // Use the reactive query to load conversation by ID
        return await fetchConversationById(conversationId)
      } catch (error) {
        console.error('Failed to load conversation history:', error)
        return null
      }
    },
    [fetchConversationById]
  )

  // Load full conversation after showing quick messages
  const loadFullConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return

      try {
        console.log('🔄 Loading full conversation:', conversationId)

        // Load the full conversation history using reactive query
        const fullConversation = await fetchConversationById(conversationId)

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
    [fetchConversationById, onConversationChange]
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
