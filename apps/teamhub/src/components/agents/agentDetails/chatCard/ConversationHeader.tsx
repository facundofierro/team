'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  MessageSquarePlus,
  MessageSquare,
  Loader2,
  Wrench,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolCallDialog } from './ToolCallDialog'
import type { ToolCall } from '@agelum/db'

type ConversationHeaderProps = {
  currentConversation?: {
    id: string
    title: string
    messageCount: number
    isActive: boolean
  } | null
  toolCallMessages?: (any & { toolCall?: ToolCall })[]
  onNewConversation: () => void
  isLoading?: boolean
  className?: string
}

export function ConversationHeader({
  currentConversation,
  toolCallMessages = [],
  onNewConversation,
  isLoading = false,
  className,
}: ConversationHeaderProps) {
  // Extract all tool calls from tool call messages
  const allToolCalls = toolCallMessages
    .filter((msg) => msg.toolCall)
    .map((msg) => msg.toolCall)
    .filter(Boolean) as ToolCall[]

  const toolCallCount = allToolCalls.length

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 border-b bg-gray-50/50 min-h-[60px]',
        className
      )}
    >
      {/* Current Conversation Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {currentConversation ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MessageSquare className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">
                {currentConversation.title}
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{currentConversation.messageCount} messages</span>

                {/* Tool Calls Info */}
                {toolCallCount > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer">
                        <Wrench className="w-3 h-3" />
                        <span>
                          {toolCallCount} tool{toolCallCount !== 1 ? 's' : ''}
                        </span>
                        <Eye className="w-3 h-3" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Tool Calls in Conversation ({toolCallCount})
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {allToolCalls.map((toolCall, index) => (
                          <div
                            key={toolCall.id || index}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                Tool #{index + 1}: {toolCall.name}
                              </h4>
                              <span
                                className={cn(
                                  'text-xs px-2 py-1 rounded',
                                  toolCall.status === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : toolCall.status === 'error'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                )}
                              >
                                {toolCall.status || 'unknown'}
                              </span>
                            </div>

                            {/* Tool Arguments */}
                            {toolCall.arguments && (
                              <div className="mb-2">
                                <div className="text-xs font-medium text-gray-600 mb-1">
                                  Arguments:
                                </div>
                                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                  {typeof toolCall.arguments === 'string'
                                    ? toolCall.arguments
                                    : JSON.stringify(
                                        toolCall.arguments,
                                        null,
                                        2
                                      )}
                                </pre>
                              </div>
                            )}

                            {/* Tool Result */}
                            {toolCall.result && (
                              <div>
                                <div className="text-xs font-medium text-gray-600 mb-1">
                                  Result:
                                </div>
                                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-40">
                                  {typeof toolCall.result === 'string'
                                    ? toolCall.result
                                    : JSON.stringify(toolCall.result, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}

                        {toolCallCount === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No tool calls found in this conversation</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {currentConversation.isActive && (
                  <span className="text-orange-600 font-medium">• Active</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">No active conversation</span>
          </div>
        )}
      </div>

      {/* New Conversation Button */}
      <Button
        onClick={onNewConversation}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex items-center gap-2 flex-shrink-0 ml-3"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageSquarePlus className="w-4 h-4" />
        )}
        New Chat
      </Button>
    </div>
  )
}
