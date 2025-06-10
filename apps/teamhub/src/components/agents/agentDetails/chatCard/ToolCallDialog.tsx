import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, Wrench, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolCall } from '@teamhub/db'
import { ArgumentsDisplay } from './ArgumentsDisplay'
import { SearchResultCard } from './SearchResultCard'
import {
  getToolDisplayName,
  isSearchTool,
  parseSearchResults,
  inferToolName,
} from './toolUtils'

interface ToolCallDialogProps {
  toolCall: ToolCall
}

export function ToolCallDialog({ toolCall }: ToolCallDialogProps) {
  // Infer the actual tool name from arguments if the name looks like an ID
  const inferredToolName = inferToolName(toolCall)

  // Parse search results if this is a search tool
  const isSearchToolType = isSearchTool(inferredToolName)
  let searchResults: any[] = []

  if (isSearchToolType && toolCall.result) {
    searchResults = parseSearchResults(toolCall.result)

    // Log for debugging
    console.log('Search results parsed:', {
      originalName: toolCall.name,
      inferredName: inferredToolName,
      resultType: typeof toolCall.result,
      isArray: Array.isArray(toolCall.result),
      parsedCount: searchResults.length,
      firstResult: searchResults[0],
    })
  }

  const toolDisplayName = getToolDisplayName(inferredToolName)

  // Debug logging to see what we're getting
  console.log('ToolCallDialog debug:', {
    toolCallId: toolCall.id,
    originalToolName: toolCall.name,
    inferredToolName,
    toolDisplayName,
    arguments: toolCall.arguments,
    result: toolCall.result,
    toolCall,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-2 text-left justify-start"
          title={`View ${toolDisplayName} details`}
        >
          <div className="flex items-center gap-2 w-full">
            <div
              className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                toolCall.status === 'success'
                  ? 'bg-green-500'
                  : toolCall.status === 'error'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
              )}
            />
            {isSearchToolType ? (
              <Search className="w-3 h-3 text-blue-600" />
            ) : (
              <Wrench className="w-3 h-3 text-blue-600" />
            )}
            <span className="text-xs text-blue-600 font-medium truncate">
              {toolDisplayName}
            </span>
            <Eye className="w-3 h-3 text-blue-400 ml-auto" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSearchToolType ? (
                <Search className="w-4 h-4 text-blue-600" />
              ) : (
                <Wrench className="w-4 h-4 text-blue-600" />
              )}
              {toolDisplayName}
              {searchResults.length > 0 && (
                <span className="text-sm text-gray-500 font-normal">
                  ({searchResults.length} results)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs mr-4">
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  toolCall.status === 'success'
                    ? 'bg-green-500'
                    : toolCall.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                )}
              />
              <span className="capitalize text-gray-600">
                {toolCall.status}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                {new Date(toolCall.timestamp).toLocaleString()}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ArgumentsDisplay
            arguments={toolCall.arguments}
            toolName={inferredToolName}
          />

          {toolCall.result && (
            <div>
              {isSearchToolType && searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <SearchResultCard
                      key={index}
                      result={result}
                      index={index}
                    />
                  ))}
                </div>
              ) : isSearchToolType ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <Search className="w-3 h-3" />
                    <span>
                      No search results found or failed to parse results
                    </span>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                      View raw result data
                    </summary>
                    <pre className="mt-2 bg-gray-100 p-3 rounded-lg overflow-x-auto max-h-40 text-xs">
                      {typeof toolCall.result === 'string'
                        ? toolCall.result
                        : JSON.stringify(toolCall.result, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto max-h-60">
                  {typeof toolCall.result === 'string'
                    ? toolCall.result
                    : JSON.stringify(toolCall.result, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
