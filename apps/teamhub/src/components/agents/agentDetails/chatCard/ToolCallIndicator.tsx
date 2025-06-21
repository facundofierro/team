import type { ToolCall } from '@teamhub/db'
import { ToolCallDialog } from './ToolCallDialog'

interface ToolCallIndicatorProps {
  toolCalls: ToolCall[]
}

export function ToolCallIndicator({ toolCalls }: ToolCallIndicatorProps) {
  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {toolCalls.map((toolCall) => (
        <div
          key={toolCall.id}
          className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
        >
          <ToolCallDialog toolCall={toolCall} />
        </div>
      ))}
    </div>
  )
}
