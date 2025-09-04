import { Button } from '@/components/ui/button'
import { Brain } from 'lucide-react'
import { DialogClose } from '@/components/ui/dialog'
import type { Memory } from '@agelum/db'

type TestMemory = {
  id: string
  name: string
}

type MemoriesDialogContentProps = {
  memories: TestMemory[]
  selectedMemories: TestMemory[]
  onMemoryToggle: (memory: TestMemory) => void
  onSave?: () => void
}

export function MemoriesDialogContent({
  memories,
  selectedMemories,
  onMemoryToggle,
  onSave,
}: MemoriesDialogContentProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        {memories.map((memory) => {
          const isSelected = selectedMemories.some((m) => m.id === memory.id)
          return (
            <Button
              key={memory.id}
              variant="outline"
              className={`justify-start ${
                isSelected ? 'bg-purple-100 dark:bg-purple-900/30' : ''
              }`}
              onClick={() => onMemoryToggle(memory)}
            >
              <Brain className="w-4 h-4 mr-2" />
              {memory.name}
            </Button>
          )
        })}
      </div>
      <div className="flex justify-center w-full">
        <DialogClose asChild>
          <Button onClick={onSave ?? (() => {})}>Accept</Button>
        </DialogClose>
      </div>
    </div>
  )
}
