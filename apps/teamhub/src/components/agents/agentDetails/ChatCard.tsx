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

type ChatCardProps = {
  scheduled?: {
    date: Date
    description: string
  }
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
        // Get the last message content as text
        const lastMessage = messages[messages.length - 1]
        return {
          text: lastMessage?.content || '',
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
        {/* Agent Info Bar */}
        {selectedAgent && (
          <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900">
                {selectedAgent.name}
              </h2>
              {availableToolsCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  <Wrench className="w-3 h-3" />
                  <span>{availableToolsCount} tools</span>
                </div>
              )}
            </div>
          </div>
        )}

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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
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
