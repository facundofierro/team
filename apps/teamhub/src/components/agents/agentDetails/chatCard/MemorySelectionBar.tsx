import { Button } from '@/components/ui/button'
import { Plus, X, MoreHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MemoriesDialogContent } from './MemoriesDialogContent'
import type { TestMemory } from '../types'
import { cn } from '@/lib/utils'

// Add test data
const TEST_MEMORIES: TestMemory[] = [
  { id: '1', name: 'Previous conversation history' },
  { id: '2', name: 'User preferences' },
  { id: '3', name: 'Task context' },
  { id: '4', name: 'Project requirements' },
  { id: '5', name: 'Meeting notes' },
  { id: '6', name: 'Technical specifications' },
  { id: '7', name: 'User feedback' },
  { id: '8', name: 'System status' },
  { id: '9', name: 'Error logs' },
  { id: '10', name: 'Performance metrics' },
]

type MemorySelectionBarProps = {
  selectedMemories: TestMemory[]
  onAddMemory: (memory: TestMemory) => void
  onRemoveMemory: (memoryId: string) => void
  onClearAllMemories: () => void
  hasInstances: boolean
  instancesCollapsed: boolean
}

export function MemorySelectionBar({
  selectedMemories,
  onAddMemory,
  onRemoveMemory,
  onClearAllMemories,
  hasInstances,
  instancesCollapsed,
}: MemorySelectionBarProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background h-9">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add memories</DialogTitle>
          </DialogHeader>
          <MemoriesDialogContent
            memories={TEST_MEMORIES}
            selectedMemories={selectedMemories}
            onMemoryToggle={onAddMemory}
          />
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          'flex flex-1 gap-2 overflow-hidden no-scrollbar',
          !hasInstances && 'w-[calc(100vw-650px)]',
          hasInstances && instancesCollapsed && 'w-[calc(100vw-700px)]',
          hasInstances && !instancesCollapsed && 'w-[calc(100vw-900px)]'
        )}
      >
        {selectedMemories.length > 0 ? (
          <>
            {selectedMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-purple-100 rounded-2xl dark:bg-purple-900/30 whitespace-nowrap"
              >
                {memory.name}
                <button
                  onClick={() => onRemoveMemory(memory.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            Add some memories here...
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 ml-1"
        onClick={() => {
          onClearAllMemories()
        }}
        title="Clear all memories"
        disabled={selectedMemories.length === 0}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
