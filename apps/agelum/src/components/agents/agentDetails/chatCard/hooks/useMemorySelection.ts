import { useState, useCallback } from 'react'

// Simple type for chat memory selection (temporary until full migration to DB types)
type TestMemory = {
  id: string
  name: string
}

export function useMemorySelection() {
  const [selectedMemories, setSelectedMemories] = useState<TestMemory[]>([])

  const handleAddMemory = useCallback((memory: TestMemory) => {
    setSelectedMemories((prev) => {
      const exists = prev.some((m) => m.id === memory.id)
      if (exists) {
        return prev.filter((m) => m.id !== memory.id)
      }
      return [...prev, memory]
    })
  }, [])

  const handleRemoveMemory = useCallback((memoryId: string) => {
    setSelectedMemories((prev) => prev.filter((m) => m.id !== memoryId))
  }, [])

  const handleClearAllMemories = useCallback(() => {
    setSelectedMemories([])
  }, [])

  const resetMemorySelection = useCallback(() => {
    setSelectedMemories([])
  }, [])

  return {
    selectedMemories,
    handleAddMemory,
    handleRemoveMemory,
    handleClearAllMemories,
    resetMemorySelection,
  }
}
