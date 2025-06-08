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
} from 'lucide-react'
import { useState } from 'react'
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
import type { TestMemory } from './types'
import type { AgentToolPermissions } from '@teamhub/db'
import ReactMarkdown from 'react-markdown'

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
}

// Component to format message content with markdown support
function MessageContent({
  content,
  isUser,
}: {
  content: string
  isUser: boolean
}) {
  if (isUser) {
    // For user messages, keep simple text formatting with URL detection
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)

    return (
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
    )
  }

  // For AI messages, use full markdown rendering
  return (
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
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          // Custom bold text styling
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
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
            <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mb-2 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function ChatCard({ scheduled }: ChatCardProps) {
  const [isInstancesOpen, setIsInstancesOpen] = useState(true)
  const selectedAgent = useAgentStore((state) => state.selectedAgent)
  const [selectedMemories, setSelectedMemories] = useState<TestMemory[]>([])

  // Get available tools count
  const agentToolPermissions =
    selectedAgent?.toolPermissions as AgentToolPermissions
  const availableToolsCount = agentToolPermissions?.rules?.length || 0

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
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

        {/* Chat Messages Area */}
        <ScrollArea className="flex-1 px-4 min-h-0">
          <div className="py-4 space-y-4">
            {messages.map((message: Message) => (
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
                  content={message.content}
                  isUser={message.role === 'user'}
                />
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100/40 text-gray-900 p-4 rounded-lg max-w-[80%]">
                <p className="text-sm">Thinking...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input Area */}
        <div className="flex-shrink-0 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
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
                disabled={isLoading}
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
                  disabled={isLoading}
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
