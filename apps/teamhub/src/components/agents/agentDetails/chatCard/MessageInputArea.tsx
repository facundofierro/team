import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Send } from 'lucide-react'
import { MemorySelectionBar } from './MemorySelectionBar'

// Simple type for chat memory selection (temporary until full migration to DB types)
type TestMemory = {
  id: string
  name: string
}

type MessageInputAreaProps = {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isCreatingConversation: boolean
  selectedMemories: TestMemory[]
  onAddMemory: (memory: TestMemory) => void
  onRemoveMemory: (memoryId: string) => void
  onClearAllMemories: () => void
  hasInstances: boolean
  instancesCollapsed: boolean
}

export function MessageInputArea({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isCreatingConversation,
  selectedMemories,
  onAddMemory,
  onRemoveMemory,
  onClearAllMemories,
  hasInstances,
  instancesCollapsed,
}: MessageInputAreaProps) {
  return (
    <div className="flex-shrink-0 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
        <MemorySelectionBar
          selectedMemories={selectedMemories}
          onAddMemory={onAddMemory}
          onRemoveMemory={onRemoveMemory}
          onClearAllMemories={onClearAllMemories}
          hasInstances={hasInstances}
          instancesCollapsed={instancesCollapsed}
        />

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 h-36 resize-none"
            rows={1}
            disabled={isLoading || isCreatingConversation}
          />

          <div className="flex flex-col justify-around w-24 flex-shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="w-full text-xs"
                >
                  New Task
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create task for agent</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {/* Task creation form would go here */}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="w-full text-xs"
                >
                  Message
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Send new message to agent</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {/* Task creation form would go here */}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="icon"
              type="submit"
              disabled={isLoading || isCreatingConversation}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
