import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Settings2 } from 'lucide-react'
import { ToolWithTypes } from '@teamhub/db'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CurrentToolsListProps {
  tools: ToolWithTypes[]
  onRemoveTool: (toolId: string) => void
  onConfigureTool: (tool: ToolWithTypes) => void
}

export function CurrentToolsList({
  tools,
  onRemoveTool,
  onConfigureTool,
}: CurrentToolsListProps) {
  // Sort tools by createdAt date (newest first)
  const sortedTools = [...tools].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA // Sort descending (newest first)
  })

  const formatAddedDate = (date: Date) => {
    const now = new Date()
    const diffInHours =
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">My Tools</CardTitle>
          {sortedTools.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {sortedTools.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="p-4 space-y-3">
            {sortedTools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No tools added yet. Browse available tools to get started.
                </p>
              </div>
            ) : (
              sortedTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {tool.name}
                        </h4>
                        {tool.createdAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatAddedDate(tool.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {tool.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          • {tool.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {tool.isManaged && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • Managed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                        title="Configure tool"
                        onClick={() => onConfigureTool(tool)}
                      >
                        <Settings2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        title="Remove tool"
                        onClick={() => onRemoveTool(tool.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
