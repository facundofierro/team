import { ExternalLink } from 'lucide-react'
import { Message } from '@ai-sdk/react'
import { memo } from 'react'
import type { ToolCall } from '@agelum/db'
import { ToolCallIndicator } from './ToolCallIndicator'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface ToolCallMessage extends Message {
  toolCall?: ToolCall // This should be singular, not plural
  toolCalls?: ToolCall[] // Keep both for compatibility
}

interface MessageContentProps {
  message: ToolCallMessage
  isUser: boolean
  isStreaming?: boolean
}

export const MessageContent = memo(
  function MessageContent({
    message,
    isUser,
    isStreaming = false,
  }: MessageContentProps) {
    if (isUser) {
      // For user messages, keep simple text formatting with URL detection
      const urlRegex = /(https?:\/\/[^\s\)]+)/g
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
          {/* Tool calls for user messages - handle both singular and plural */}
          <ToolCallIndicator
            toolCalls={
              message.toolCalls || (message.toolCall ? [message.toolCall] : [])
            }
          />
        </div>
      )
    }

    // For AI messages, use optimized markdown rendering with streaming support
    return (
      <div>
        <MarkdownRenderer
          content={message.content}
          variant="chat"
          isStreaming={isStreaming}
        />
        {/* Tool calls for AI messages - handle both singular and plural */}
        <ToolCallIndicator
          toolCalls={
            message.toolCalls || (message.toolCall ? [message.toolCall] : [])
          }
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    return (
      // Compare basic properties
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.role === nextProps.message.role &&
      prevProps.isUser === nextProps.isUser &&
      prevProps.isStreaming === nextProps.isStreaming &&
      // Compare tool calls array (handle both singular and plural)
      JSON.stringify(
        prevProps.message.toolCalls ||
          (prevProps.message.toolCall ? [prevProps.message.toolCall] : [])
      ) ===
        JSON.stringify(
          nextProps.message.toolCalls ||
            (nextProps.message.toolCall ? [nextProps.message.toolCall] : [])
        )
    )
  }
)

MessageContent.displayName = 'MessageContent'
