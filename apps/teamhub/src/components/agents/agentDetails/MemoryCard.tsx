'use client'

import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TestMemory } from './types'

type MemoryCardProps = {
  memories: TestMemory[]
  selectedMemoryId?: string
  onMemorySelect: (memoryId: string) => void
}

export function MemoryCard({
  memories,
  selectedMemoryId,
  onMemorySelect,
}: MemoryCardProps) {
  const selectedMemory = memories.find((m) => m.id === selectedMemoryId)

  if (memories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border rounded-lg bg-card">
        <div className="text-sm text-muted-foreground">
          No memories available yet
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4 border rounded-lg bg-card">
      {/* Left sidebar with memories list */}
      <div className="w-64 border-r">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {memories.map((memory) => (
              <Button
                key={memory.id}
                variant="ghost"
                className={`w-full justify-start ${
                  selectedMemoryId === memory.id
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : ''
                }`}
                onClick={() => onMemorySelect(memory.id)}
              >
                <Brain className="w-4 h-4 mr-2" />
                <span className="truncate">{memory.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            {selectedMemory ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedMemory.name}</h3>
                {/* Add your memory content here */}
                <div className="text-sm text-muted-foreground">
                  Memory content goes here...
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Select a memory to view its content
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
