'use client'

import { useState, useMemo, useEffect } from 'react'
import { Brain, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { MemoryWithTypes } from '@teamhub/db'

type MemoryCardProps = {
  agentId: string
  selectedMemoryId?: string
  onMemorySelect: (memoryId: string) => void
}

export function MemoryCard({
  agentId,
  selectedMemoryId,
  onMemorySelect,
}: MemoryCardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [memories, setMemories] = useState<MemoryWithTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentOrganization } = useOrganizationStore()

  // Fetch memories from API
  useEffect(() => {
    const fetchMemories = async () => {
      if (!currentOrganization?.id || !agentId) return

      setLoading(true)
      try {
        const url = new URL(
          `/api/agents/${agentId}/memories`,
          window.location.origin
        )
        url.searchParams.set('organizationId', currentOrganization.id)
        if (searchTerm.trim()) {
          url.searchParams.set('search', searchTerm)
        }

        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error('Failed to fetch memories')
        }

        const data = await response.json()
        setMemories(data.memories || [])
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch memories'
        )
        setMemories([])
      } finally {
        setLoading(false)
      }
    }

    fetchMemories()
  }, [agentId, currentOrganization?.id, searchTerm])

  // Filter and sort memories
  const filteredAndSortedMemories = useMemo(() => {
    // Memories are already filtered by search on the server
    // Just sort by creation time (most recent first) since they come pre-sorted
    return memories
  }, [memories])

  const selectedMemory = memories.find((m) => m.id === selectedMemoryId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full border rounded-lg bg-card">
        <div className="text-sm text-muted-foreground">Loading memories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full border rounded-lg bg-card">
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (memories.length === 0 && !searchTerm) {
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
        {/* Search input */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Memories list */}
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {filteredAndSortedMemories.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No memories found
              </div>
            ) : (
              filteredAndSortedMemories.map((memory) => (
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
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="truncate text-sm font-medium">
                      {memory.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {memory.createdAt
                          ? new Date(memory.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </span>
                      {memory.type && (
                        <span className="text-xs bg-muted px-1 rounded">
                          {memory.type}
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            {selectedMemory ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {selectedMemory.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>
                      Created on{' '}
                      {selectedMemory.createdAt
                        ? new Date(
                            selectedMemory.createdAt
                          ).toLocaleDateString()
                        : 'Unknown'}{' '}
                      at{' '}
                      {selectedMemory.createdAt
                        ? new Date(
                            selectedMemory.createdAt
                          ).toLocaleTimeString()
                        : 'Unknown'}
                    </span>
                    {selectedMemory.type && (
                      <span className="bg-muted px-2 py-1 rounded">
                        Type: {selectedMemory.type}
                      </span>
                    )}
                    {selectedMemory.category && (
                      <span className="bg-muted px-2 py-1 rounded">
                        Category: {selectedMemory.category}
                      </span>
                    )}
                    {selectedMemory.importance && (
                      <span className="bg-muted px-2 py-1 rounded">
                        Importance: {selectedMemory.importance}/10
                      </span>
                    )}
                  </div>
                </div>

                {selectedMemory.summary && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Summary</h4>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {selectedMemory.summary}
                    </div>
                  </div>
                )}

                {selectedMemory.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Description</h4>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {selectedMemory.description}
                    </div>
                  </div>
                )}

                {selectedMemory.keyTopics &&
                  selectedMemory.keyTopics.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Topics</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedMemory.keyTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMemory.lastAccessedAt && (
                  <div className="text-xs text-muted-foreground">
                    Last accessed:{' '}
                    {new Date(selectedMemory.lastAccessedAt).toLocaleString()}
                  </div>
                )}
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
