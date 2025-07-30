'use client'

import { useChat, Message } from '@ai-sdk/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useAgentStore } from '@/stores/agentStore'
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
import type { AgentToolPermissions, ConversationMemory } from '@teamhub/db'

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
  conversationToLoad?: string
  onConversationLoaded?: () => void
}

export function ChatCard({
  scheduled,
  conversationToLoad,
  onConversationLoaded,
}: ChatCardProps) {
  const selectedAgent = useAgentStore((state) => state.selectedAgent)

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
    switchToConversation,
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

  // Handle conversation loading from memory card double-click
  useEffect(() => {
    if (conversationToLoad && switchToConversation) {
      switchToConversation(conversationToLoad)
        .then(() => {
          onConversationLoaded?.()
        })
        .catch((error) => {
          onConversationLoaded?.() // Still call to clear the loading state
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
    onFinish: undefined, // Will be set by tool call processor
    onError: undefined, // Will be set by tool call processor
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
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

  // Safe message loading - only when explicitly switching conversations
  useEffect(() => {
    // Only load if we have a conversation with content and we're not actively chatting
    if (
      currentConversation?.content &&
      !isActiveChatting &&
      messages.length === 0
    ) {
      console.log(
        '📨 Loading messages for conversation:',
        currentConversation.id
      )

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

      setMessages(chatMessages)
      // Note: We'd need to update the tool call processor to handle loaded messages

      console.log(
        '✅ Loaded',
        chatMessages.length,
        'messages from conversation'
      )
    }
  }, [
    currentConversation?.id,
    currentConversation?.content,
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

  return (
    <Card className="flex h-full overflow-hidden bg-white">
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
      <div className="flex flex-col flex-1 min-w-0 bg-[#f8f9fa]">
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
