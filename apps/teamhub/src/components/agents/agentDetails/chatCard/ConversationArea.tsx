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
    isStreaming = false,
  }: {
    message: Message & { toolCall?: ToolCall }
    className?: string
    isStreaming?: boolean
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
          isStreaming={isStreaming && message.role === 'assistant'}
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
      prevProps.isStreaming === nextProps.isStreaming &&
      // Compare tool call if present
      JSON.stringify(prevProps.message.toolCall) ===
        JSON.stringify(nextProps.message.toolCall)
    )
  }
)

MemoizedMessageItem.displayName = 'MemoizedMessageItem'

// Simplified pagination settings
const DEFAULT_VISIBLE_MESSAGES = 50 // Show last 50 messages by default
const STREAMING_VISIBLE_MESSAGES = 30 // Reduce during streaming for performance
const LOAD_MORE_BATCH_SIZE = 25 // Load 25 more messages at a time
const SCROLL_THRESHOLD = 100 // Pixels from top to trigger auto-load

export const ConversationArea = memo(function ConversationArea({
  messages,
  toolCallMessages,
  isLoading,
}: ConversationAreaProps) {
  // Simple pagination state
  const [visibleMessageCount, setVisibleMessageCount] = useState(
    DEFAULT_VISIBLE_MESSAGES
  )
  const [isStreamingMode, setIsStreamingMode] = useState(false)
  const [shouldMaintainScroll, setShouldMaintainScroll] = useState(false)
  const [isNearTop, setIsNearTop] = useState(false)

  // Refs for scroll management
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<NodeJS.Timeout>()

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

  // Simple message sorting and combining
  const sortedMessages = useMemo(() => {
    const allMessages = [...messages, ...toolCallMessages]
    console.log('🔄 [ConversationArea] Processing messages:', {
      messages: messages.length,
      toolCallMessages: toolCallMessages.length,
      total: allMessages.length
    })

    const sorted = allMessages.sort((a, b) => {
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

    console.log('✅ [ConversationArea] Sorted messages:', sorted.length)
    return sorted
  }, [messages, toolCallMessages])

  // Simple visible messages calculation
  const { visibleMessages, hasMoreMessages, hiddenMessageCount } = useMemo(() => {
    const totalMessages = sortedMessages.length
    const hasMore = totalMessages > visibleMessageCount
    
    // Show the most recent messages (last N messages)
    const startIndex = Math.max(0, totalMessages - visibleMessageCount)
    const visible = sortedMessages.slice(startIndex)
    const hiddenCount = Math.max(0, totalMessages - visibleMessageCount)

    console.log('📏 [ConversationArea] Simple pagination:', {
      totalMessages,
      visibleCount: visible.length,
      startIndex,
      hasMore,
      hiddenCount
    })

    return {
      visibleMessages: visible,
      hasMoreMessages: hasMore,
      hiddenMessageCount: hiddenCount,
    }
  }, [sortedMessages, visibleMessageCount])

  // Simple load more handler
  const handleLoadMore = useCallback(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    const currentScrollHeight = scrollElement?.scrollHeight || 0

    setShouldMaintainScroll(true)

    // Calculate how many more messages to show
    const remaining = hiddenMessageCount
    const batchSize = remaining <= 10 ? remaining : Math.min(LOAD_MORE_BATCH_SIZE, remaining)

    setVisibleMessageCount((prev) => Math.min(prev + batchSize, sortedMessages.length))

    // Maintain scroll position after loading more messages
    setTimeout(() => {
      if (scrollElement) {
        const newScrollHeight = scrollElement.scrollHeight
        const scrollDiff = newScrollHeight - currentScrollHeight
        scrollElement.scrollTop = scrollElement.scrollTop + scrollDiff
      }
      setShouldMaintainScroll(false)
    }, 0)
  }, [hiddenMessageCount, sortedMessages.length])

  // Simple scroll handling
  const handleScroll = useCallback(
    (event: Event) => {
      const scrollElement = event.target as HTMLElement
      const scrollTop = scrollElement.scrollTop

      // Check if near top for auto-loading
      const nearTop = scrollTop < SCROLL_THRESHOLD
      setIsNearTop(nearTop)

      // Throttled scroll handling
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current)
      }

      scrollThrottleRef.current = setTimeout(() => {
        // Auto-load when scrolling near top (user wants to see older messages)
        if (nearTop && hasMoreMessages && !isLoading && !shouldMaintainScroll) {
          handleLoadMore()
        }
      }, 100) // Throttle scroll events
    },
    [hasMoreMessages, isLoading, shouldMaintainScroll, handleLoadMore]
  )

  // Attach scroll listener
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current)
      }
    }
  }, [handleScroll])

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (!shouldMaintainScroll && !isNearTop) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollElement) {
        // Check if user is at or near the bottom
        const isAtBottom =
          scrollElement.scrollTop + scrollElement.clientHeight >=
          scrollElement.scrollHeight - 50

        // Auto-scroll to bottom if user is already at bottom or if it's a small conversation
        if (isAtBottom || visibleMessages.length <= DEFAULT_VISIBLE_MESSAGES) {
          scrollElement.scrollTop = scrollElement.scrollHeight
        }
      }
    }
  }, [visibleMessages.length, shouldMaintainScroll, isNearTop])

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 px-4">
      <div className="py-4 space-y-4">
        {/* Simple Message Pagination Component */}
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
          <div key={message.id} data-message-id={message.id}>
            <MemoizedMessageItem message={message} isStreaming={isLoading} />
          </div>
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

        {/* Simple performance info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
            <div>
              📊 Simple Pagination: {visibleMessages.length}/{sortedMessages.length}{' '}
              messages visible
            </div>
            <div>
              🔧 Tool calls: {toolCallMessages.length} tool messages
            </div>
            <div className="flex gap-2 mt-1">
              {isStreamingMode && (
                <span className="bg-orange-100 px-1 rounded">
                  Streaming Mode
                </span>
              )}
              {isNearTop && (
                <span className="bg-gray-100 px-1 rounded">Near Top</span>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
})

ConversationArea.displayName = 'ConversationArea'
