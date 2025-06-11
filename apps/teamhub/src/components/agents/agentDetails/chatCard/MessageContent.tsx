import { ExternalLink } from 'lucide-react'
import { Message } from '@ai-sdk/react'
import type { ToolCall } from '@teamhub/db'
import { ToolCallIndicator } from './ToolCallIndicator'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface ToolCallMessage extends Message {
  toolCalls?: ToolCall[]
}

interface MessageContentProps {
  message: ToolCallMessage
  isUser: boolean
}

export function MessageContent({ message, isUser }: MessageContentProps) {
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
      <MarkdownRenderer content={message.content} variant="chat" />
      {/* Tool calls for AI messages */}
      <ToolCallIndicator toolCalls={message.toolCalls || []} />
    </div>
  )
}
