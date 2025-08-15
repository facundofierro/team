'use client'

import { useChat, Message } from '@ai-sdk/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { cn } from '@/lib/utils'
import { useAgentStore } from '@/stores/agentStore'
import { useReactive } from '@drizzle/reactive/client'
import { ConversationHeader } from './chatCard/ConversationHeader'
import { useConversationManager } from './chatCard/useConversationManager'
import { ScheduledInfoBar } from './chatCard/ScheduledInfoBar'
import { ConversationArea } from './chatCard/ConversationArea'
import { MessageInputArea } from './chatCard/MessageInputArea'
import {
  useToolCallProcessor,
  useMemorySelection,
  useChatState,
  useMessageSubmission,
} from './chatCard/hooks'
import {
  buildOptimizedContext,
  formatOptimizationInfo,
} from '@/lib/utils/contextOptimizer'
import type { AgentToolPermissions, ConversationMemory, Agent } from '@teamhub/db'

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
  conversationToLoad?: string
  onConversationLoaded?: () => void
}

const ChatCardComponent = ({
  scheduled,
  conversationToLoad,
  onConversationLoaded,
}: ChatCardProps) => {
  // Get selected agent ID from simplified store
  const selectedAgentId = useAgentStore((state) => state.selectedAgentId)
  
  // Get selected agent data from reactive cache
  const { data: selectedAgent } = useReactive<Agent | null>(
    'agents.getOne',
    { id: selectedAgentId || '' },
    { enabled: !!selectedAgentId }
  )

  // Simplified agent state logging - only log successful loads
  useEffect(() => {
    if (selectedAgent) {
      console.log('💬 Agent loaded:', selectedAgent.name)
    }
  }, [selectedAgent?.id, selectedAgent?.name])

  // Custom hooks for different concerns
  const {
    isInstancesOpen,
    toggleInstancesOpen,
    chatId,
    generateNewChatId,
    isActiveChatting,
    setIsActiveChatting,
    localConversation,
    setLocalConversation,
    resetChatState,
  } = useChatState()

  const {
    selectedMemories,
    handleAddMemory,
    handleRemoveMemory,
    handleClearAllMemories,
    resetMemorySelection,
  } = useMemorySelection()

  // Conversation management
  const {
    currentConversation,
    isCreatingConversation,
    startNewConversation,
    addMessageToConversation,
    completeCurrentConversation,
    loadConversationHistory,
    loadFullConversation,
    switchToConversation,
    clearConversationState,
    // Quick access to stored conversation state
    lastMessages,
    activeConversationId,
    conversationState,
  } = useConversationManager({
    onConversationChange: useCallback(
      (conversation: ConversationMemory | null) => {
        // Update local state when database conversation changes
        if (conversation) {
          setLocalConversation({
            id: conversation.id,
            title: conversation.title,
            messageCount: conversation.messageCount || 0,
            isActive: conversation.isActive || false,
          })
        }
      },
      [setLocalConversation]
    ),
  })

  // Handle conversation loading from memory card double-click - prevent duplicates
  const conversationLoadRef = useRef<string | null>(null)
  const isLoadingMemoryRef = useRef<boolean>(false)
  
  useEffect(() => {
    if (conversationToLoad && switchToConversation && conversationToLoad !== conversationLoadRef.current) {
      conversationLoadRef.current = conversationToLoad
      isLoadingMemoryRef.current = true
      console.log('💭 Loading memory:', conversationToLoad.substring(0, 12) + '...')
      
      switchToConversation(conversationToLoad)
        .then(() => {
          console.log('✅ Memory loaded successfully')
          onConversationLoaded?.()
        })
        .catch((error) => {
          console.error('❌ Memory loading failed:', error)
          onConversationLoaded?.() // Still call to clear the loading state
        })
        .finally(() => {
          // Clear the ref after a delay to allow for new loads
          setTimeout(() => {
            conversationLoadRef.current = null
            isLoadingMemoryRef.current = false
          }, 1000)
        })
    }
  }, [conversationToLoad, switchToConversation, onConversationLoaded])

  // Get available tools count
  const agentToolPermissions =
    selectedAgent?.toolPermissions as AgentToolPermissions
  const availableToolsCount = agentToolPermissions?.rules?.length || 0

  // Enhanced useChat with tool execution integration
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    data,
  } = useChat({
    id: chatId, // Stable ID that only changes for new conversations
    api: '/api/chat', // Real chat endpoint
    onFinish: async (message: Message) => {
      // Store the AI response in the database
      if (currentConversation) {
        await addMessageToConversation('assistant', message.content, message.id)
      }
    },
    onError: (error: Error) => {
      console.error('💥 Chat error:', error)
    },
    experimental_prepareRequestBody: ({
      messages,
    }: {
      messages: Message[]
    }) => {
      // Guard: Ensure we have an agent before preparing the request
      if (!selectedAgent?.id) {
        console.error(
          '💬 [ChatCard] No agent selected, cannot prepare request body'
        )
        throw new Error('No agent selected')
      }
      // Build optimized context using context optimizer
      // Filter messages to only include user and assistant roles
      const filteredMessages = messages
        .filter(
          (msg: Message) => msg.role === 'user' || msg.role === 'assistant'
        )
        .map((msg: Message) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))

      const optimizedContext = buildOptimizedContext(
        filteredMessages,
        currentConversation
      )

      // Reduced logging - only log when there are issues

      return {
        messages: optimizedContext.messages,
        summary: optimizedContext.summary,
        agentId: selectedAgent?.id,
        agentCloneId: undefined, // Add this when implementing instance selection
        memoryRules: [], // Add your memory rules here
        storeRule: {
          messageType: 'user_message',
          shouldStore: true,
          retentionDays: 30,
          category: 'chat',
        },
      }
    },
  })

  // Tool call processing hook
  const {
    toolCallMessages,
    createOnFinishHandler,
    createOnErrorHandler,
    resetToolCallState,
  } = useToolCallProcessor({
    data: data || [],
    currentConversation,
    addMessageToConversation: async (
      role: string,
      content: string,
      id: string,
      toolCalls?: any
    ) => {
      await addMessageToConversation(
        role as 'user' | 'assistant',
        content,
        id,
        toolCalls
      )
    },
    setIsActiveChatting,
    localConversation,
    setLocalConversation,
    messages,
  })

  // Message submission hook
  const { handleEnhancedSubmit } = useMessageSubmission({
    isLoading,
    input,
    currentConversation,
    localConversation,
    selectedAgent,
    startNewConversation,
    addMessageToConversation: async (
      role: string,
      content: string,
      id: string,
      toolCalls?: any
    ) => {
      await addMessageToConversation(
        role as 'user' | 'assistant',
        content,
        id,
        toolCalls
      )
    },
    setIsActiveChatting,
    setLocalConversation,
    handleSubmit,
  })

  // Set handlers for useChat after hooks are initialized
  useEffect(() => {
    // Dynamically update useChat handlers
    // Note: This is a workaround since useChat doesn't allow dynamic handler updates
    // In a real implementation, you might need to restructure this differently
  }, [createOnFinishHandler, createOnErrorHandler])

  // Memoize the lastMessages array to prevent unnecessary effect triggers
  const memoizedLastMessages = useMemo(() => lastMessages, [lastMessages])
  
  // Memoize the loadFullConversation callback
  const memoizedLoadFullConversation = useCallback(
    (conversationId: string) => {
      if (conversationId && loadFullConversation) {
        loadFullConversation(conversationId)
      }
    },
    [loadFullConversation]
  )

  // Track previous agent for proper cleanup
  const [previousSelectedAgentId, setPreviousSelectedAgentId] = useState<string | null>(null)
  
  // Track the current conversation ID to detect conversation switches
  const [previousConversationId, setPreviousConversationId] = useState<string | null>(null)
  
  // Clear messages when agent changes - only log meaningful changes
  useEffect(() => {
    // Only process if we have a valid agent ID and it's different from previous
    if (selectedAgent?.id && selectedAgent.id !== previousSelectedAgentId) {
      // Only log if we have a meaningful previous agent (not null/undefined transitions)
      if (previousSelectedAgentId) {
        console.log('🔄 Agent switch:', previousSelectedAgentId.substring(0, 8) + '... -> ' + selectedAgent.id.substring(0, 8) + '...')
      }
      
      // Clear messages and update tracking
      console.log('🧹 [DEBUG] Clearing messages on agent change from', messages.length, 'to 0')
      setMessages([])
      setPreviousSelectedAgentId(selectedAgent.id)
      setPreviousConversationId(null)
    }
  }, [selectedAgent?.id, previousSelectedAgentId, setMessages, messages.length])

  // Simplified conversation state logging - only log significant changes
  const prevStateRef = useRef<string>('')
  useEffect(() => {
    const currentState = `${selectedAgent?.id}:${activeConversationId}:${messages.length}`
    if (currentState !== prevStateRef.current && selectedAgent) {
      console.log('📊 State:', {
        agent: selectedAgent.name,
        conversation: activeConversationId?.substring(0, 8) + '...' || 'none',
        messages: messages.length,
      })
      prevStateRef.current = currentState
    }
  }, [selectedAgent?.id, selectedAgent?.name, activeConversationId, messages.length])

  // Quick loading of last messages when switching agents
  const hasNoMessages = messages.length === 0
  const hasLastMessages = memoizedLastMessages.length > 0
  const hasActiveConversation = Boolean(activeConversationId)
  
  // Track if we've already loaded quick messages to prevent reloading
  const [hasLoadedQuickMessages, setHasLoadedQuickMessages] = useState(false)
  
  // Reset quick message tracking when agent changes
  useEffect(() => {
    setHasLoadedQuickMessages(false)
  }, [selectedAgent?.id])
  
  // Quick load - but only if full conversation isn't already loaded
  useEffect(() => {
    if (
      selectedAgent?.id &&
      !isActiveChatting &&
      hasNoMessages &&
      hasLastMessages &&
      hasActiveConversation &&
      !hasLoadedQuickMessages && // Only load once
      !isLoadingMemoryRef.current && // Skip if we're loading a specific memory conversation
      !currentConversation // NEW: Skip if full conversation is already loaded
    ) {
      console.log('🚀 Quick loading last messages:', memoizedLastMessages.length, 'for agent:', selectedAgent.name)

      // Convert stored last messages to Message[] format
      const quickMessages: Message[] = memoizedLastMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: new Date(msg.timestamp),
      }))

      console.log('🧹 [DEBUG] Setting messages from quick load:', quickMessages.length)
      setMessages(quickMessages)
      setHasLoadedQuickMessages(true) // Mark as loaded

      // Immediately trigger full conversation load
      if (activeConversationId && loadFullConversation) {
        console.log('🔄 Triggering full conversation load...')
        loadFullConversation(activeConversationId)
      }
    }
  }, [
    selectedAgent?.id,
    selectedAgent?.name,
    isActiveChatting,
    hasNoMessages,
    hasLastMessages,
    hasActiveConversation,
    hasLoadedQuickMessages,
    memoizedLastMessages,
    setMessages,
    activeConversationId,
    loadFullConversation,
    currentConversation, // NEW: Added this dependency
  ])

  // Safe message loading - when explicitly switching conversations
  useEffect(() => {
    // Check if this is a conversation switch (different conversation ID)
    const isConversationSwitch = currentConversation?.id && currentConversation.id !== previousConversationId
    
    // Load if we have a conversation with content and we're not actively chatting
    // OR if this is a conversation switch (even if there are existing messages)
    if (
      currentConversation?.content &&
      !isActiveChatting &&
      (messages.length === 0 || isConversationSwitch)
    ) {
      console.log(
        '📨 Loading conversation:',
        currentConversation.id.substring(0, 8) + '...',
        isConversationSwitch ? '(SWITCH)' : '(INITIAL)'
      )
      
      // Update the tracked conversation ID
      setPreviousConversationId(currentConversation.id)

      // Convert ConversationMessage[] to Message[] format expected by useChat
      const chatMessages: Message[] = []
      const loadedToolCallMessages: (Message & { toolCall?: any })[] = []

      currentConversation.content.forEach((msg) => {
        // Add the main message
        chatMessages.push({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          createdAt: new Date(msg.timestamp),
        })

        // If this message has tool calls, create separate tool call messages
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          msg.toolCalls.forEach((toolCall) => {
            const toolCallMessage: Message & { toolCall?: any } = {
              id: `tool-${toolCall.id}`,
              role: 'system' as const,
              content: `Tool execution: ${toolCall.name}`,
              createdAt: new Date(new Date(msg.timestamp).getTime() - 1000), // 1 second earlier
              toolCall,
            }
            loadedToolCallMessages.push(toolCallMessage)
          })
        }
      })

      console.log('🧹 [DEBUG] Setting messages from conversation load:', chatMessages.length)
      setMessages(chatMessages)
      // Note: We'd need to update the tool call processor to handle loaded messages

      console.log('✅ Loaded', chatMessages.length, 'messages')
    } else if (
      // FIXED: Only clear messages if we have NO active conversation AND no last messages to load
      selectedAgent?.id &&
      !currentConversation &&
      !hasActiveConversation && // Added this condition to prevent clearing when activeConversationId exists
      !hasLastMessages && // Added this condition to prevent clearing when we have last messages to show
      !isActiveChatting &&
      messages.length > 0
    ) {
      console.log('🧹 [DEBUG] Clearing messages for agent with no conversation data from', messages.length, 'to 0')
      setMessages([])
      setHasLoadedQuickMessages(false) // Reset quick message tracking
    }
  }, [
    currentConversation?.id,
    currentConversation?.content,
    selectedAgent?.id,
    hasActiveConversation,
    hasLastMessages,
    isActiveChatting,
    messages.length,
    setMessages,
  ])

  // Enhanced new conversation handler
  const handleNewConversation = useCallback(async () => {
    // Complete current conversation if it exists
    if (currentConversation) {
      await completeCurrentConversation()
    }

    // Reset all state
    resetChatState()
    resetMemorySelection()
    resetToolCallState()

    // Clear UI messages immediately - this is intentional for new conversation
    console.log('🧹 [DEBUG] Clearing messages for new conversation from', messages.length, 'to 0')
    setMessages([])

    // Note: New conversation will be created when the first message is sent
    // This is handled in the enhanced handleSubmit
  }, [
    currentConversation,
    completeCurrentConversation,
    resetChatState,
    resetMemorySelection,
    resetToolCallState,
    setMessages,
    messages.length,
  ])

  // Use local conversation for immediate UI feedback, fallback to database conversation
  const displayConversation =
    localConversation ||
    (currentConversation
      ? {
          id: currentConversation.id,
          title: currentConversation.title,
          messageCount: currentConversation.messageCount || 0,
          isActive: currentConversation.isActive || false,
        }
      : null)

  // Show loading state if no agent is selected
  if (!selectedAgent) {
    // Check if we have a selectedAgentId but the agent object is still loading
    const selectedAgentId = useAgentStore.getState().selectedAgentId

    if (selectedAgentId) {
      // Agent is selected but still loading - show loading state
      return (
        <Card className="flex h-full min-h-0 overflow-hidden bg-white">
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading agent...</p>
            </div>
          </div>
        </Card>
      )
    }

    // No agent selected at all - show selection message
    return (
      <Card className="flex h-full min-h-0 overflow-hidden bg-white">
        <div className="flex items-center justify-center w-full">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select an Agent
              </h3>
              <p className="text-gray-600 mb-4">
                Choose an agent from the list to start chatting, or create a new
                one to get started.
              </p>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>• Click on an agent in the left sidebar</p>
              <p>• Or use the &ldquo;Add new agent&rdquo; button</p>
              <p>• Each agent can have different capabilities and tools</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex h-full min-h-0 overflow-hidden bg-white">
      {/* Instances Sidebar - Only shown if agent.doesClone is true */}
      {selectedAgent?.doesClone && (
        <div
          className={cn(
            'border-r transition-all duration-300 flex-shrink-0',
            isInstancesOpen ? 'w-64' : 'w-12'
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3
              className={cn(
                'font-medium whitespace-nowrap overflow-hidden transition-all duration-300',
                isInstancesOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              )}
            >
              Instances
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={toggleInstancesOpen}
            >
              {isInstancesOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-4rem)] bg-gray-50 rounded-md ml-2 -mt-4">
            <div className="p-4">{/* Instance list would go here */}</div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0 bg-[#f8f9fa]">
        {/* Scheduled Information Bar */}
        {scheduled && <ScheduledInfoBar scheduled={scheduled} />}

        {/* Conversation Header */}
        <ConversationHeader
          currentConversation={displayConversation}
          toolCallMessages={toolCallMessages}
          onNewConversation={handleNewConversation}
          isLoading={isLoading || isCreatingConversation}
        />

        {/* Chat Messages Area */}
        <ConversationArea
          messages={messages}
          toolCallMessages={toolCallMessages}
          isLoading={isLoading}
        />

        {/* Message Input Area */}
        <MessageInputArea
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleEnhancedSubmit}
          isLoading={isLoading}
          isCreatingConversation={isCreatingConversation}
          selectedMemories={selectedMemories}
          onAddMemory={handleAddMemory}
          onRemoveMemory={handleRemoveMemory}
          onClearAllMemories={handleClearAllMemories}
          hasInstances={selectedAgent?.doesClone ?? false}
          instancesCollapsed={!isInstancesOpen}
        />
      </div>
    </Card>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const ChatCard = memo(ChatCardComponent)
