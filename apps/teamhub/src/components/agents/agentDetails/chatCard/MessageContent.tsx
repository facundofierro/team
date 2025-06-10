import { ExternalLink } from 'lucide-react'
import { Message } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import type { ToolCall } from '@teamhub/db'
import { ToolCallIndicator } from './ToolCallIndicator'

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
              <ul className="list-disc list-inside mb-2 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-2 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            // Custom bold text styling
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
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
              <h1 className="text-lg font-bold mb-2 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold mb-2 text-gray-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-bold mb-1 text-gray-900">
                {children}
              </h3>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {/* Tool calls for AI messages */}
      <ToolCallIndicator toolCalls={message.toolCalls || []} />
    </div>
  )
}
