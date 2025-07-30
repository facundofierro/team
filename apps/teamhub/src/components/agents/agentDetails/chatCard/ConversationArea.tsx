import { Message } from '@ai-sdk/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolCallIndicator } from './ToolCallIndicator'
import { MessageContent } from './MessageContent'
import { MessagePagination } from './MessagePagination'
import { useMemo, useState, useCallback, useEffect, useRef, memo } from 'react'
import type { ToolCall } from '@teamhub/db'

interface ToolCallMessage extends Message {
  toolCall?: ToolCall
}

type ConversationAreaProps = {
  messages: Message[]
  toolCallMessages: (Message & { toolCall?: ToolCall })[]
  isLoading: boolean
}

// Memoized Message Component to prevent unnecessary re-renders
const MemoizedMessageItem = memo(
  ({
    message,
    className,
  }: {
    message: Message & { toolCall?: ToolCall }
    className?: string
  }) => {
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
            : 'bg-gray-100/40 text-gray-900',
          className
        )}
      >
        <MessageContent
          message={message as ToolCallMessage}
          isUser={message.role === 'user'}
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.role === nextProps.message.role &&
      prevProps.className === nextProps.className &&
      // Compare tool call if present
      JSON.stringify(prevProps.message.toolCall) ===
        JSON.stringify(nextProps.message.toolCall)
    )
  }
)

MemoizedMessageItem.displayName = 'MemoizedMessageItem'

// Default pagination settings
const DEFAULT_VISIBLE_MESSAGES = 50
const STREAMING_VISIBLE_MESSAGES = 30
const LOAD_MORE_BATCH_SIZE = 25

export const ConversationArea = memo(function ConversationArea({
  messages,
  toolCallMessages,
  isLoading,
}: ConversationAreaProps) {
  // Pagination state
  const [visibleMessageCount, setVisibleMessageCount] = useState(
    DEFAULT_VISIBLE_MESSAGES
  )
  const [isStreamingMode, setIsStreamingMode] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [shouldMaintainScroll, setShouldMaintainScroll] = useState(false)

  // Detect streaming mode based on isLoading state
  useEffect(() => {
    if (isLoading && !isStreamingMode) {
      // Entering streaming mode - reduce visible messages for performance
      setIsStreamingMode(true)
      setVisibleMessageCount(STREAMING_VISIBLE_MESSAGES)
    } else if (!isLoading && isStreamingMode) {
      // Exiting streaming mode - restore normal pagination
      setIsStreamingMode(false)
      setVisibleMessageCount(DEFAULT_VISIBLE_MESSAGES)
    }
  }, [isLoading, isStreamingMode])

  // Memoized message sorting - only recalculate when messages change
  const sortedMessages = useMemo(() => {
    const allMessages = [...messages, ...toolCallMessages]

    return allMessages.sort((a, b) => {
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
    })
  }, [messages, toolCallMessages])

  // Memoized visible messages - only recalculate when sortedMessages or pagination changes
  const { visibleMessages, hasMoreMessages, hiddenMessageCount } =
    useMemo(() => {
      const totalMessages = sortedMessages.length
      const hasMore = totalMessages > visibleMessageCount
      const startIndex = Math.max(0, totalMessages - visibleMessageCount)
      const visible = sortedMessages.slice(startIndex)
      const hiddenCount = Math.max(0, totalMessages - visibleMessageCount)

      return {
        visibleMessages: visible,
        hasMoreMessages: hasMore,
        hiddenMessageCount: hiddenCount,
      }
    }, [sortedMessages, visibleMessageCount])

  // Load more messages handler
  const handleLoadMore = useCallback(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    const currentScrollHeight = scrollElement?.scrollHeight || 0

    setShouldMaintainScroll(true)

    setVisibleMessageCount((prev) =>
      Math.min(prev + LOAD_MORE_BATCH_SIZE, sortedMessages.length)
    )

    // Maintain scroll position after loading more messages
    setTimeout(() => {
      if (scrollElement) {
        const newScrollHeight = scrollElement.scrollHeight
        const scrollDiff = newScrollHeight - currentScrollHeight
        scrollElement.scrollTop = scrollElement.scrollTop + scrollDiff
      }
      setShouldMaintainScroll(false)
    }, 0)
  }, [sortedMessages.length])

  // Auto-scroll to bottom for new messages (but not when loading more)
  useEffect(() => {
    if (!shouldMaintainScroll && !isStreamingMode) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [visibleMessages.length, shouldMaintainScroll, isStreamingMode])

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 min-h-0">
      <div className="py-4 space-y-4">
        {/* Message Pagination Component */}
        <MessagePagination
          hasMoreMessages={hasMoreMessages}
          hiddenMessageCount={hiddenMessageCount}
          visibleMessageCount={visibleMessages.length}
          totalMessageCount={sortedMessages.length}
          isStreamingMode={isStreamingMode}
          isLoading={isLoading}
          batchSize={LOAD_MORE_BATCH_SIZE}
          onLoadMore={handleLoadMore}
        />

        {/* Render visible messages */}
        {visibleMessages.map((message: Message & { toolCall?: ToolCall }) => (
          <MemoizedMessageItem key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="p-4 rounded-lg max-w-[80%] break-words bg-gray-100/40 text-gray-900">
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

        {/* Performance info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
            📊 Performance: {visibleMessages.length}/{sortedMessages.length}{' '}
            messages visible
            {isStreamingMode && ' (Streaming Mode)'}
          </div>
        )}
      </div>
    </ScrollArea>
  )
})

ConversationArea.displayName = 'ConversationArea'
