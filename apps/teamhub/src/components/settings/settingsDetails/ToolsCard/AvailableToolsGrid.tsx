import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ToolType } from '@teamhub/db'
import { Badge } from '@/components/ui/badge'

interface AvailableToolsGridProps {
  toolTypes: ToolType[]
  onAddTool: (toolType: ToolType) => void
}

export function AvailableToolsGrid({
  toolTypes,
  onAddTool,
}: AvailableToolsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {toolTypes.map((toolType) => (
        <Card
          key={toolType.id}
          className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{toolType.type}</CardTitle>
              {toolType.canBeManaged && (
                <Badge variant="secondary" className="text-xs">
                  Managed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {toolType.description || 'No description available'}
            </p>

            {toolType.managedPriceDescription && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                {toolType.managedPriceDescription}
              </p>
            )}

            <Button
              onClick={() => onAddTool(toolType)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
