'use client'

import { Button } from '@/components/ui/button'
import { MessageSquarePlus, MessageSquare, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConversationHeaderProps = {
  currentConversation?: {
    id: string
    title: string
    messageCount: number
    isActive: boolean
  } | null
  onNewConversation: () => void
  isLoading?: boolean
  className?: string
}

export function ConversationHeader({
  currentConversation,
  onNewConversation,
  isLoading = false,
  className,
}: ConversationHeaderProps) {
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
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{currentConversation.messageCount} messages</span>
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
