'use client'

import { useChat, Message } from '@ai-sdk/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import {
  Send,
  ListTodo,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Brain,
  Plus,
  X,
  Trash2,
  MoreHorizontal,
  Wrench,
  ExternalLink,
  Code,
  Eye,
  Search,
  Globe,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAgentStore } from '@/stores/agentStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MemoriesDialogContent } from './chatCard/MemoriesDialogContent'
import { MemorySelectionBar } from './chatCard/MemorySelectionBar'
import { ConversationHeader } from './chatCard/ConversationHeader'
import { useConversationManager } from './chatCard/useConversationManager'
import { SearchResultCard } from './chatCard/SearchResultCard'
import { ArgumentsDisplay } from './chatCard/ArgumentsDisplay'
import { ToolCallDialog } from './chatCard/ToolCallDialog'
import { ToolCallIndicator } from './chatCard/ToolCallIndicator'
import { MessageContent } from './chatCard/MessageContent'
import { parseToolError } from './chatCard/toolUtils'
import type {
  AgentToolPermissions,
  ConversationMemory,
  ConversationMessage,
  ToolCall,
} from '@teamhub/db'

// Simple type for chat memory selection (temporary until full migration to DB types)
type TestMemory = {
  id: string
  name: string
}

interface ToolCallMessage extends Message {
  toolCalls?: ToolCall[]
}

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
  conversationToLoad?: string
  onConversationLoaded?: () => void
}

// Function to extract tool calls from message content (no longer used, kept for compatibility)
function extractToolCalls(message: Message): ToolCall[] {
  // Tool calls are now separate messages in the conversation
  // This function is kept for compatibility but not actively used
  return []
}

export function ChatCard({
  scheduled,
  conversationToLoad,
  onConversationLoaded,
}: ChatCardProps) {
  const { toast } = useToast()
  const [isInstancesOpen, setIsInstancesOpen] = useState(true)
  const selectedAgent = useAgentStore((state) => state.selectedAgent)
  const [selectedMemories, setSelectedMemories] = useState<TestMemory[]>([])
  // Use a stable chat ID that doesn't change unless we want to reset the entire chat
  const [chatId, setChatId] = useState<string>(() => `chat_${Date.now()}`)

  // Track if we're currently in an active chat to prevent message overwrites
  const [isActiveChatting, setIsActiveChatting] = useState(false)

  // Local conversation state for immediate UI feedback
  const [localConversation, setLocalConversation] = useState<{
    id: string
    title: string
    messageCount: number
    isActive: boolean
  } | null>(null)

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
    onConversationChange: (conversation) => {
      // Update local state when database conversation changes
      if (conversation) {
        setLocalConversation({
          id: conversation.id,
          title: conversation.title,
          messageCount: conversation.messageCount || 0,
          isActive: conversation.isActive || false,
        })
      }
      console.log('🔄 Conversation state changed:', conversation)
    },
  })

  // Debug conversation state changes
  useEffect(() => {
    console.log('📊 Current conversation state:', {
      hasConversation: !!currentConversation,
      conversationId: currentConversation?.id,
      title: currentConversation?.title,
      messageCount: currentConversation?.messageCount,
      isActive: currentConversation?.isActive,
    })
  }, [currentConversation])

  // Handle conversation loading from memory card double-click
  useEffect(() => {
    if (conversationToLoad && switchToConversation) {
      console.log('🔄 Loading conversation from memory:', conversationToLoad)
      switchToConversation(conversationToLoad)
        .then(() => {
          console.log('✅ Conversation loaded successfully')
          onConversationLoaded?.()
        })
        .catch((error) => {
          console.error('❌ Failed to load conversation:', error)
          onConversationLoaded?.() // Still call to clear the loading state
        })
    }
  }, [conversationToLoad, switchToConversation, onConversationLoaded])

  // Get available tools count
  const agentToolPermissions =
    selectedAgent?.toolPermissions as AgentToolPermissions
  const availableToolsCount = agentToolPermissions?.rules?.length || 0

  // State for tracking processed tool call IDs to prevent duplicates
  const [processedToolCallIds, setProcessedToolCallIds] = useState<Set<string>>(
    new Set()
  )

  // Separate state for tool call messages that persist independently
  const [toolCallMessages, setToolCallMessages] = useState<
    (Message & { toolCall?: ToolCall })[]
  >([])

  // State to track tool calls that should be associated with the next assistant message
  const [pendingToolCalls, setPendingToolCalls] = useState<ToolCall[]>([])

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
    onFinish: async (message) => {
      console.log(
        '🤖 AI response finished:',
        message.content.substring(0, 50) + '...'
      )

      // Clear the active chatting flag since the conversation turn is complete
      setIsActiveChatting(false)

      // Update local conversation message count immediately
      if (localConversation) {
        setLocalConversation({
          ...localConversation,
          messageCount: messages.length + 1, // +1 for the AI response that just finished
        })
      }

      // Add AI response to database conversation with any associated tool calls
      if (currentConversation) {
        console.log(
          '📝 Adding AI response to conversation:',
          currentConversation.id,
          'with',
          pendingToolCalls.length,
          'tool calls'
        )
        await addMessageToConversation(
          'assistant',
          message.content,
          message.id,
          pendingToolCalls.length > 0 ? pendingToolCalls : undefined
        )

        // Clear pending tool calls after storing them
        setPendingToolCalls([])
      } else {
        console.warn('⚠️ No current conversation to add AI response to')
      }
    },
    onError: (error) => {
      console.error('💥 Chat error:', error)

      // Clear the active chatting flag on error
      setIsActiveChatting(false)

      // Parse the error and show appropriate toast
      let title = 'Chat Error'
      let description =
        'An error occurred while processing your message. Please try again.'

      const errorMessage = error.message || error.toString()

      if (
        errorMessage.includes('AI_ToolExecutionError') ||
        errorMessage.includes('Error executing tool')
      ) {
        // Extract tool name if possible
        const toolNameMatch =
          errorMessage.match(/tool (\w+):/i) ||
          errorMessage.match(
            /Error executing tool \w+-\w+-\w+-\w+-\w+: Failed to (\w+)/i
          )

        const toolName =
          toolNameMatch && toolNameMatch[1] === 'searchYandex'
            ? 'Yandex Search'
            : toolNameMatch
            ? toolNameMatch[1]
            : 'Unknown Tool'

        if (
          errorMessage.includes('token has expired') ||
          errorMessage.includes('401 Unauthorized')
        ) {
          title = `${toolName} - Authentication Error`
          description =
            'The API token has expired and needs to be refreshed. Please contact your administrator.'
        } else if (
          errorMessage.includes('rate limit') ||
          errorMessage.includes('429')
        ) {
          title = `${toolName} - Rate Limit`
          description =
            'API rate limit exceeded. Please try again in a few minutes.'
        } else if (
          errorMessage.includes('network') ||
          errorMessage.includes('timeout')
        ) {
          title = `${toolName} - Network Error`
          description =
            'Network connection failed. Please check your internet connection and try again.'
        } else {
          title = `${toolName} - Error`
          description =
            'Tool execution failed. Please try again or contact support if the issue persists.'
        }
      } else if (
        errorMessage.includes('network') ||
        errorMessage.includes('fetch')
      ) {
        title = 'Network Error'
        description =
          'Unable to connect to the server. Please check your internet connection and try again.'
      } else if (errorMessage.includes('timeout')) {
        title = 'Request Timeout'
        description = 'The request took too long to complete. Please try again.'
      }

      toast({
        title,
        description,
        variant: 'destructive',
      })
    },
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

  // Process streaming data for tool calls
  useEffect(() => {
    if (data && Array.isArray(data)) {
      for (const item of data) {
        if (typeof item === 'object' && item !== null) {
          const dataItem = item as any

          if (dataItem.type === 'tool-call' && dataItem.toolCall) {
            const toolCallId = dataItem.toolCall.id

            // Skip if we've already processed this tool call
            if (processedToolCallIds.has(toolCallId)) {
              continue
            }

            // Check if this is an error tool call and show toast
            if (dataItem.toolCall.status === 'error') {
              const errorInfo = parseToolError(dataItem.toolCall)
              toast({
                title: errorInfo.title,
                description: errorInfo.description,
                variant: errorInfo.variant,
              })
            }

            // Create a new tool call message with the tool call data
            // Use a timestamp that ensures it appears before the assistant response
            const toolCallMessage: Message & { toolCall?: ToolCall } = {
              id: `tool-${toolCallId}`,
              role: 'system' as const,
              content: `Tool execution: ${dataItem.toolCall.name}`,
              createdAt: new Date(Date.now() - 1000), // 1 second earlier to ensure proper ordering
              toolCall: dataItem.toolCall,
            }

            // Add the tool call message to our separate tool call messages state
            setToolCallMessages((prevToolMessages) => {
              // Check if this tool call message already exists
              const exists = prevToolMessages.some(
                (msg) => msg.id === toolCallMessage.id
              )
              if (exists) {
                return prevToolMessages
              }
              return [...prevToolMessages, toolCallMessage]
            })

            // Add tool call to pending list to be stored with the next assistant message
            setPendingToolCalls((prevPending) => {
              // Check if this tool call is already pending
              const exists = prevPending.some((tc) => tc.id === toolCallId)
              if (exists) {
                return prevPending
              }
              return [...prevPending, dataItem.toolCall]
            })

            // Mark this tool call as processed
            setProcessedToolCallIds((prev) => new Set([...prev, toolCallId]))
          }

          // Handle tool execution errors that might come through different stream types
          if (dataItem.type === 'error' && dataItem.error) {
            // Check if this is a tool execution error
            if (
              dataItem.error.includes('AI_ToolExecutionError') ||
              dataItem.error.includes('Error executing tool') ||
              dataItem.error.includes('tool execution')
            ) {
              let toolName = 'Unknown Tool'
              let errorMessage = dataItem.error

              // Try to extract tool name and error details
              const toolNameMatch = dataItem.error.match(/tool (\w+):/i)
              if (toolNameMatch) {
                toolName =
                  toolNameMatch[1] === 'searchYandex'
                    ? 'Yandex Search'
                    : toolNameMatch[1]
              }

              // Parse specific error types from the error message
              let title = `${toolName} - Error`
              let description =
                'Tool execution failed. Please try again or contact support if the issue persists.'

              if (
                errorMessage.includes('token has expired') ||
                errorMessage.includes('401 Unauthorized')
              ) {
                title = `${toolName} - Authentication Error`
                description =
                  'The API token has expired and needs to be refreshed. Please contact your administrator.'
              } else if (
                errorMessage.includes('rate limit') ||
                errorMessage.includes('429')
              ) {
                title = `${toolName} - Rate Limit`
                description =
                  'API rate limit exceeded. Please try again in a few minutes.'
              } else if (
                errorMessage.includes('network') ||
                errorMessage.includes('timeout') ||
                errorMessage.includes('ECONNREFUSED')
              ) {
                title = `${toolName} - Network Error`
                description =
                  'Network connection failed. Please check your internet connection and try again.'
              } else if (
                errorMessage.includes('quota') ||
                errorMessage.includes('exceeded')
              ) {
                title = `${toolName} - Quota Exceeded`
                description =
                  'API quota has been exceeded. Please try again later or contact your administrator.'
              } else if (
                errorMessage.includes('403') ||
                errorMessage.includes('Forbidden') ||
                errorMessage.includes('permission')
              ) {
                title = `${toolName} - Permission Error`
                description =
                  'Insufficient permissions to access this resource. Please contact your administrator.'
              }

              toast({
                title,
                description,
                variant: 'destructive',
              })
            }
          }
        }
      }
    }
  }, [data, processedToolCallIds, toast])

  // Load conversation messages when switching to a conversation or when conversation is first loaded
  useEffect(() => {
    const loadConversationMessages = async () => {
      // Don't load messages if we're actively chatting to prevent overwriting in-progress conversations
      if (isActiveChatting) {
        console.log('⏸️ Skipping message loading - active chat in progress')
        return
      }

      // Load messages if we have a conversation with content
      if (currentConversation && currentConversation.content) {
        console.log('📚 Loading conversation messages:', currentConversation.id)

        // Convert ConversationMessage[] to Message[] format expected by useChat
        const chatMessages: Message[] = []
        const loadedToolCallMessages: (Message & { toolCall?: ToolCall })[] = []

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
              const toolCallMessage: Message & { toolCall?: ToolCall } = {
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

        console.log('🔄 Setting messages for conversation load')
        setMessages(chatMessages)
        setToolCallMessages(loadedToolCallMessages)

        // Update processed tool call IDs to prevent duplicates
        const loadedToolCallIds = new Set(
          loadedToolCallMessages
            .map((msg) => msg.toolCall?.id)
            .filter(Boolean) as string[]
        )
        setProcessedToolCallIds(loadedToolCallIds)

        console.log(
          '✅ Loaded',
          chatMessages.length,
          'messages and',
          loadedToolCallMessages.length,
          'tool calls from conversation'
        )
      }
    }

    loadConversationMessages()
  }, [currentConversation?.id, isActiveChatting, setMessages])

  // Enhanced new conversation handler
  const handleNewConversation = useCallback(async () => {
    // Complete current conversation if it exists
    if (currentConversation) {
      await completeCurrentConversation()
    }

    // Clear the active chatting flag
    setIsActiveChatting(false)

    // Clear UI messages immediately - this is intentional for new conversation
    setMessages([])

    // Clear local conversation state
    setLocalConversation(null)

    // Generate new chat ID to reset useChat state only for new conversations
    const newChatId = `chat_${Date.now()}`
    setChatId(newChatId)

    // Clear selected memories
    setSelectedMemories([])

    // Clear tool call tracking state
    setProcessedToolCallIds(new Set())
    setToolCallMessages([])
    setPendingToolCalls([])

    // Note: New conversation will be created when the first message is sent
    // This is handled in the enhanced handleSubmit below
  }, [currentConversation, completeCurrentConversation, setMessages])

  // Enhanced submit handler to create conversation on first message
  const handleEnhancedSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!input.trim() || isLoading) return

      const userMessage = input.trim()

      // Mark that we're starting an active chat session
      setIsActiveChatting(true)

      // If no current conversation exists, create database conversation FIRST
      if (!currentConversation && !localConversation && selectedAgent?.id) {
        console.log('🆕 Creating new conversation for first message...')

        // Create immediate local conversation state for UI feedback
        const tempConversation = {
          id: `temp_${Date.now()}`,
          title:
            userMessage.length > 50
              ? userMessage.substring(0, 47) + '...'
              : userMessage,
          messageCount: 1, // Will be 1 after user message is added
          isActive: true,
        }
        setLocalConversation(tempConversation)

        try {
          // Create database conversation and wait for it to complete
          const newConversation = await startNewConversation(userMessage)
          if (newConversation) {
            console.log('✅ New conversation created:', newConversation.id)
            // Add the user message to the newly created conversation
            await addMessageToConversation(
              'user',
              userMessage,
              `msg_user_${Date.now()}`, // Generate user message ID
              undefined
            )
            console.log('✅ User message added to conversation')
          } else {
            console.error('❌ Failed to create new conversation')
          }
        } catch (error) {
          console.error('Failed to start new conversation:', error)
          // Continue with regular submit even if conversation creation fails
        }
      } else if (currentConversation) {
        console.log('📝 Adding user message to existing conversation...')
        // Add user message to existing conversation
        await addMessageToConversation(
          'user',
          userMessage,
          `msg_user_${Date.now()}`, // Generate user message ID
          undefined
        )
        // Update local conversation message count immediately
        if (localConversation) {
          setLocalConversation({
            ...localConversation,
            messageCount: localConversation.messageCount + 1,
          })
        }
      } else if (localConversation) {
        // Update local conversation message count for subsequent messages
        setLocalConversation({
          ...localConversation,
          messageCount: localConversation.messageCount + 1,
        })
      }

      // Proceed with normal chat submission
      console.log('🚀 Submitting message to AI...')
      handleSubmit(e)
    },
    [
      input,
      isLoading,
      currentConversation,
      localConversation,
      selectedAgent?.id,
      startNewConversation,
      addMessageToConversation,
      handleSubmit,
    ]
  )

  const handleAddMemory = (memory: TestMemory) => {
    setSelectedMemories((prev) => {
      const exists = prev.some((m) => m.id === memory.id)
      if (exists) {
        return prev.filter((m) => m.id !== memory.id)
      }
      return [...prev, memory]
    })
  }

  const handleRemoveMemory = (memoryId: string) => {
    setSelectedMemories(selectedMemories.filter((m) => m.id !== memoryId))
  }

  const handleClearAllMemories = () => {
    setSelectedMemories([])
  }

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
              onClick={() => setIsInstancesOpen(!isInstancesOpen)}
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
        {scheduled && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-start w-full gap-2 h-14 hover:bg-accent flex-shrink-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Scheduled task - Click to view details</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Scheduled Task Details</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <p>Date: {scheduled.date.toLocaleString()}</p>
                <p>Description: {scheduled.description}</p>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Conversation Header */}
        <ConversationHeader
          currentConversation={displayConversation}
          onNewConversation={handleNewConversation}
          isLoading={isLoading || isCreatingConversation}
        />

        {/* Chat Messages Area */}
        <ScrollArea className="flex-1 px-4 min-h-0">
          <div className="py-4 space-y-4">
            {(() => {
              // Combine and sort all messages with proper ordering logic
              const allMessages = [...messages, ...toolCallMessages].sort(
                (a, b) => {
                  const timeA = a.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0
                  const timeB = b.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0

                  // If timestamps are very close (within 2 seconds), enforce logical order
                  if (Math.abs(timeA - timeB) < 2000) {
                    // Tool calls (system messages) should come before assistant responses
                    if (a.role === 'system' && b.role === 'assistant') return -1
                    if (a.role === 'assistant' && b.role === 'system') return 1
                    // User messages should come before everything else
                    if (
                      a.role === 'user' &&
                      (b.role === 'system' || b.role === 'assistant')
                    )
                      return -1
                    if (
                      (a.role === 'system' || a.role === 'assistant') &&
                      b.role === 'user'
                    )
                      return 1
                  }

                  return timeA - timeB
                }
              )

              return allMessages.map(
                (message: Message & { toolCall?: ToolCall }) => {
                  // Check if this is a tool call message
                  if (message.role === 'system' && message.toolCall) {
                    return (
                      <div
                        key={message.id}
                        className="p-4 rounded-lg max-w-[80%] break-words bg-blue-50 border border-blue-200"
                      >
                        <ToolCallIndicator toolCalls={[message.toolCall]} />
                      </div>
                    )
                  }

                  // Regular message rendering
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'p-4 rounded-lg max-w-[80%] break-words',
                        message.role === 'user'
                          ? 'bg-gray-100/60 ml-auto text-orange-600 font-medium'
                          : 'bg-gray-100/40 text-gray-900'
                      )}
                    >
                      <MessageContent
                        message={message as ToolCallMessage}
                        isUser={message.role === 'user'}
                      />
                    </div>
                  )
                }
              )
            })()}
            {isLoading && (
              <div className="bg-gray-100/40 text-gray-900 p-4 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 animate-pulse text-orange-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input Area */}
        <div className="flex-shrink-0 border-t bg-white">
          <form
            onSubmit={handleEnhancedSubmit}
            className="flex flex-col gap-2 p-4"
          >
            <MemorySelectionBar
              selectedMemories={selectedMemories}
              onAddMemory={handleAddMemory}
              onRemoveMemory={handleRemoveMemory}
              onClearAllMemories={handleClearAllMemories}
              hasInstances={selectedAgent?.doesClone ?? false}
              instancesCollapsed={!isInstancesOpen}
            />

            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1 h-36 resize-none"
                rows={1}
                disabled={isLoading || isCreatingConversation}
              />

              <div className="flex flex-col justify-around w-24 flex-shrink-0">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      className="w-full text-xs"
                    >
                      New Task
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Create task for agent</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      {/* Task creation form would go here */}
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      className="w-full text-xs"
                    >
                      Message
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Send new message to agent</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      {/* Task creation form would go here */}
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="default"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="icon"
                  type="submit"
                  disabled={isLoading || isCreatingConversation}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Card>
  )
}
