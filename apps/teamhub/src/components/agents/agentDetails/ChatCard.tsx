'use client'

import { useChat, Message } from '@ai-sdk/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import type { TestMemory } from './types'
import type { AgentToolPermissions, ConversationMemory } from '@teamhub/db'
import ReactMarkdown from 'react-markdown'

// Tool call interfaces
interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  status: 'pending' | 'success' | 'error'
  timestamp: Date
}

interface ToolCallMessage extends Message {
  toolCalls?: ToolCall[]
}

// Tool Call Dialog Component
function ToolCallDialog({ toolCall }: { toolCall: ToolCall }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-2 text-left justify-start"
        >
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3" />
            <span className="text-xs font-medium">{toolCall.name}</span>
            <Eye className="w-3 h-3 opacity-60" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Tool Call: {toolCall.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  toolCall.status === 'success'
                    ? 'bg-green-500'
                    : toolCall.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                )}
              />
              <span className="text-sm capitalize">{toolCall.status}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {toolCall.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Arguments
            </h4>
            <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
              {JSON.stringify(toolCall.arguments, null, 2)}
            </pre>
          </div>

          {toolCall.result && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Result</h4>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40">
                {typeof toolCall.result === 'string'
                  ? toolCall.result
                  : JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Tool Call Indicator Component
function ToolCallIndicator({ toolCalls }: { toolCalls: ToolCall[] }) {
  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {toolCalls.map((toolCall) => (
        <div
          key={toolCall.id}
          className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              toolCall.status === 'success'
                ? 'bg-green-500'
                : toolCall.status === 'error'
                ? 'bg-red-500'
                : 'bg-yellow-500 animate-pulse'
            )}
          />
          <Wrench className="w-3 h-3 text-blue-600 flex-shrink-0" />
          <span className="text-xs text-blue-700 font-medium flex-1">
            Called {toolCall.name}
          </span>
          <ToolCallDialog toolCall={toolCall} />
        </div>
      ))}
    </div>
  )
}

// Function to extract or simulate tool calls from message content
function extractToolCalls(message: Message): ToolCall[] {
  // This is a mock implementation - in a real scenario, tool calls would be
  // included in the message data structure from the AI SDK

  // For now, we'll simulate tool calls by looking for certain patterns in AI messages
  if (message.role !== 'assistant') return []

  const toolCalls: ToolCall[] = []
  const content = message.content.toLowerCase()

  // Simulate tool calls based on content patterns
  if (content.includes('search') || content.includes('finding')) {
    toolCalls.push({
      id: `tool_${Date.now()}_search`,
      name: 'web_search',
      arguments: { query: 'extracted search terms' },
      result: 'Search completed successfully',
      status: 'success',
      timestamp: new Date(),
    })
  }

  if (
    content.includes('file') ||
    content.includes('read') ||
    content.includes('write')
  ) {
    toolCalls.push({
      id: `tool_${Date.now()}_file`,
      name: 'file_operations',
      arguments: { action: 'read', path: '/path/to/file' },
      result: 'File operation completed',
      status: 'success',
      timestamp: new Date(),
    })
  }

  if (content.includes('database') || content.includes('query')) {
    toolCalls.push({
      id: `tool_${Date.now()}_db`,
      name: 'database_query',
      arguments: { sql: 'SELECT * FROM table' },
      result: 'Query executed successfully',
      status: 'success',
      timestamp: new Date(),
    })
  }

  return toolCalls
}

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
}

// Component to format message content with markdown support
function MessageContent({
  message,
  isUser,
}: {
  message: ToolCallMessage
  isUser: boolean
}) {
  if (isUser) {
    // For user messages, keep simple text formatting with URL detection
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = message.content.split(urlRegex)

    return (
      <div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {parts.map((part, index) => {
            if (urlRegex.test(part)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline hover:no-underline transition-colors text-orange-700 hover:text-orange-800"
                >
                  {part}
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              )
            }
            return part
          })}
        </p>
        {/* Tool calls for user messages (if any) */}
        <ToolCallIndicator toolCalls={message.toolCalls || []} />
      </div>
    )
  }

  // For AI messages, use full markdown rendering
  return (
    <div>
      <div className="text-sm leading-relaxed text-gray-900">
        <ReactMarkdown
          components={{
            // Custom link component
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline hover:no-underline transition-colors"
              >
                {children}
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            ),
            // Custom paragraph styling
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            // Custom list styling
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-2 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-2 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="ml-2">{children}</li>,
            // Custom bold text styling
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            // Custom italic text styling
            em: ({ children }) => (
              <em className="italic text-gray-800">{children}</em>
            ),
            // Custom code styling
            code: ({ children }) => (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ),
            // Custom code block styling
            pre: ({ children }) => (
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto mb-2">
                {children}
              </pre>
            ),
            // Custom heading styling
            h1: ({ children }) => (
              <h1 className="text-lg font-bold mb-2 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold mb-2 text-gray-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-bold mb-1 text-gray-900">
                {children}
              </h3>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {/* Tool calls for AI messages */}
      <ToolCallIndicator toolCalls={message.toolCalls || []} />
    </div>
  )
}

export function ChatCard({ scheduled }: ChatCardProps) {
  const [isInstancesOpen, setIsInstancesOpen] = useState(true)
  const selectedAgent = useAgentStore((state) => state.selectedAgent)
  const [selectedMemories, setSelectedMemories] = useState<TestMemory[]>([])
  const [chatId, setChatId] = useState<string>(() => `chat_${Date.now()}`)

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

  // Get available tools count
  const agentToolPermissions =
    selectedAgent?.toolPermissions as AgentToolPermissions
  const availableToolsCount = agentToolPermissions?.rules?.length || 0

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    id: chatId, // Dynamic ID for resetting chat
    api: '/api/chat', // Real chat endpoint
    onFinish: async (message) => {
      console.log(
        '🤖 AI response finished:',
        message.content.substring(0, 50) + '...'
      )
      // Update local conversation message count immediately
      if (localConversation) {
        setLocalConversation({
          ...localConversation,
          messageCount: messages.length + 1, // +1 for the AI response that just finished
        })
      }

      // Add AI response to database conversation
      if (currentConversation) {
        console.log(
          '📝 Adding AI response to conversation:',
          currentConversation.id
        )
        await addMessageToConversation('assistant', message.content, message.id)
      } else {
        console.warn('⚠️ No current conversation to add AI response to')
      }
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

  // Enhanced new conversation handler
  const handleNewConversation = useCallback(async () => {
    // Complete current conversation if it exists
    if (currentConversation) {
      await completeCurrentConversation()
    }

    // Clear UI messages immediately
    setMessages([])

    // Clear local conversation state
    setLocalConversation(null)

    // Generate new chat ID to reset useChat state
    const newChatId = `chat_${Date.now()}`
    setChatId(newChatId)

    // Clear selected memories
    setSelectedMemories([])

    // Note: New conversation will be created when the first message is sent
    // This is handled in the enhanced handleSubmit below
  }, [currentConversation, completeCurrentConversation, setMessages])

  // Enhanced submit handler to create conversation on first message
  const handleEnhancedSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!input.trim() || isLoading) return

      const userMessage = input.trim()

      // If no current conversation exists, create immediate local state and database conversation
      if (!currentConversation && !localConversation && selectedAgent?.id) {
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

        // Create database conversation in background
        try {
          const newConversation = await startNewConversation(userMessage)
          // Add the user message to the newly created conversation
          if (newConversation) {
            await addMessageToConversation('user', userMessage)
          }
        } catch (error) {
          console.error('Failed to start new conversation:', error)
          // Continue with regular submit even if conversation creation fails
        }
      } else if (currentConversation) {
        // Add user message to existing conversation
        await addMessageToConversation('user', userMessage)
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
            {messages.map((message: Message) => {
              const messageWithToolCalls: ToolCallMessage = {
                ...message,
                toolCalls: extractToolCalls(message),
              }

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
                    message={messageWithToolCalls}
                    isUser={message.role === 'user'}
                  />
                </div>
              )
            })}
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
