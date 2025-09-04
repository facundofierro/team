import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { ToolType } from '@agelum/db'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ToolCarouselProps {
  toolTypes: ToolType[]
  onAddTool: (toolType: ToolType) => void
}

export function ToolCarousel({ toolTypes, onAddTool }: ToolCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTool = () => {
    setCurrentIndex((prev) => (prev + 1) % toolTypes.length)
  }

  const prevTool = () => {
    setCurrentIndex((prev) => (prev - 1 + toolTypes.length) % toolTypes.length)
  }

  if (toolTypes.length === 0) {
    return (
      <Card className="h-64">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No tools available</p>
        </CardContent>
      </Card>
    )
  }

  const currentTool = toolTypes[currentIndex]

  return (
    <Card className="h-64 relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{currentTool.type}</h3>
              {currentTool.canBeManaged && (
                <Badge variant="secondary" className="mb-2">
                  Managed Available
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTool}
                disabled={toolTypes.length <= 1}
              >
                {/* <ChevronLeft className="w-4 h-4" /> */}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTool}
                disabled={toolTypes.length <= 1}
              >
                {/* <ChevronRight className="w-4 h-4" /> */}
              </Button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
            {currentTool.description || 'No description available'}
          </p>

          {currentTool.managedPriceDescription && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
              {currentTool.managedPriceDescription}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {toolTypes.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>

          <Button
            onClick={() => onAddTool(currentTool)}
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {/* <Plus className="w-4 h-4 mr-2" /> */}
            Add Tool
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
