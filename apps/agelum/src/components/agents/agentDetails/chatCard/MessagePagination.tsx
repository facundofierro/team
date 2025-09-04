import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronUp, MessageSquare, Zap } from 'lucide-react'
import { memo } from 'react'

interface MessagePaginationProps {
  hasMoreMessages: boolean
  hiddenMessageCount: number
  visibleMessageCount: number
  totalMessageCount: number
  isStreamingMode: boolean
  isLoading: boolean
  batchSize: number
  onLoadMore: () => void
}

export const MessagePagination = memo(function MessagePagination({
  hasMoreMessages,
  hiddenMessageCount,
  visibleMessageCount,
  totalMessageCount,
  isStreamingMode,
  isLoading,
  batchSize,
  onLoadMore,
}: MessagePaginationProps) {
  if (!hasMoreMessages) {
    return null
  }

  const nextBatchSize = Math.min(batchSize, hiddenMessageCount)

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      {/* Load More Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onLoadMore}
        className="text-xs hover:bg-gray-50 transition-colors"
        disabled={isLoading}
      >
        <ChevronUp className="w-3 h-3 mr-1" />
        Load {nextBatchSize} more message{nextBatchSize !== 1 ? 's' : ''}
      </Button>

      {/* Message Count Information */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          <span>
            Showing {visibleMessageCount} of {totalMessageCount} messages
          </span>
        </div>

        {hiddenMessageCount > 0 && (
          <>
            <span>•</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {hiddenMessageCount} hidden
            </Badge>
          </>
        )}

        {isStreamingMode && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-500" />
              <span className="text-orange-600 font-medium">
                Performance Mode
              </span>
            </div>
          </>
        )}
      </div>

      {/* Performance Hint */}
      {hiddenMessageCount > 50 && (
        <div className="text-xs text-gray-400 max-w-md text-center">
          💡 Tip: Large conversations are automatically optimized for better
          performance
        </div>
      )}
    </div>
  )
})

MessagePagination.displayName = 'MessagePagination'
