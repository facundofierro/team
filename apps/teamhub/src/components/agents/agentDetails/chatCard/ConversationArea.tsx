import { Message } from '@ai-sdk/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolCallIndicator } from './ToolCallIndicator'
import { MessageContent } from './MessageContent'
import type { ToolCall } from '@teamhub/db'

interface ToolCallMessage extends Message {
  toolCalls?: ToolCall[]
  toolCall?: ToolCall
}

type ConversationAreaProps = {
  messages: Message[]
  toolCallMessages: (Message & { toolCall?: ToolCall })[]
  isLoading: boolean
}

export function ConversationArea({
  messages,
  toolCallMessages,
  isLoading,
}: ConversationAreaProps) {
  return (
    <ScrollArea className="flex-1 px-4 min-h-0">
      <div className="py-4 space-y-4">
        {(() => {
          // Combine and sort all messages with proper ordering logic
          const allMessages = [...messages, ...toolCallMessages].sort(
            (a, b) => {
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0

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
  )
}
