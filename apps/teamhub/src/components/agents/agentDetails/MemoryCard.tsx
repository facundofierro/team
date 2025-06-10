'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Brain,
  Search,
  MessageCircle,
  Bot,
  User,
  FileText,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { MemoryWithTypes, ConversationMessage } from '@teamhub/db'

type MemoryCardProps = {
  agentId: string
  selectedMemoryId?: string
  onMemorySelect: (memoryId: string) => void
  onConversationOpen?: (conversationId: string) => void
}

// Helper function to shorten memory titles for display
const shortenMemoryTitle = (title: string): string => {
  if (title.length <= 40) return title

  // Simple AI-like simplification - remove common phrases and shorten
  const simplified = title
    .replace(
      /^(Requirements for|Search for|Discussion about|Meeting about|Chat about)/i,
      ''
    )
    .replace(/\s+(conversation|discussion|meeting|chat)$/i, '')
    .trim()

  if (simplified.length <= 40) return simplified

  // Truncate and add ellipsis
  return simplified.substring(0, 37) + '...'
}

export function MemoryCard({
  agentId,
  selectedMemoryId,
  onMemorySelect,
  onConversationOpen,
}: MemoryCardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [memories, setMemories] = useState<MemoryWithTypes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentOrganization } = useOrganizationStore()

  // Fetch memories from API
  useEffect(() => {
    const fetchMemories = async () => {
      if (!currentOrganization?.id || !agentId) {
        console.log('MemoryCard: Missing required data:', {
          organizationId: currentOrganization?.id,
          agentId,
        })
        return
      }

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

        console.log('MemoryCard: Fetching memories from:', url.toString())
        console.log('MemoryCard: Request params:', {
          agentId,
          organizationId: currentOrganization.id,
          searchTerm: searchTerm || '(empty)',
        })

        const response = await fetch(url.toString())
        console.log('MemoryCard: Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('MemoryCard: API error response:', errorText)
          throw new Error('Failed to fetch memories')
        }

        const data = await response.json()
        console.log('MemoryCard: Response data:', data)
        console.log('MemoryCard: Memories count:', data.memories?.length || 0)

        setMemories(data.memories || [])
        setError(null)
      } catch (err) {
        console.error('MemoryCard: Fetch error:', err)
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

  // Debug logging for memory selection
  useEffect(() => {
    console.log('MemoryCard: Selection state changed:', {
      selectedMemoryId,
      hasSelectedMemory: !!selectedMemory,
      memoriesCount: memories.length,
      memoryIds: memories.map((m) => m.id),
    })
  }, [selectedMemoryId, selectedMemory, memories])

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
    <div className="flex h-full gap-4 border rounded-lg bg-background">
      {/* Left sidebar with memories list */}
      <div className="w-80 border-r bg-card">
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
                  className={`w-full justify-start p-3 h-auto ${
                    selectedMemoryId === memory.id
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : ''
                  }`}
                  onClick={() => onMemorySelect(memory.id)}
                  onDoubleClick={() => {
                    if (memory.type === 'conversation' && onConversationOpen) {
                      onConversationOpen(memory.id)
                    }
                  }}
                >
                  <div className="flex flex-col items-start min-w-0 flex-1 space-y-2">
                    <span className="text-sm font-medium leading-tight">
                      {shortenMemoryTitle(memory.title)}
                    </span>

                    {/* Search-friendly brief (description) - 2 lines max */}
                    {memory.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {memory.description}
                      </p>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0 bg-card rounded-r-lg">
        <ScrollArea className="h-full">
          <div className="p-6">
            {selectedMemory ? (
              <div className="space-y-6">
                {/* Level 1: Memory Name (Header) */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-semibold leading-tight">
                        {selectedMemory.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                        <span>
                          {selectedMemory.createdAt
                            ? new Date(
                                selectedMemory.createdAt
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Unknown date'}
                        </span>
                        {selectedMemory.type && (
                          <Badge variant="outline">{selectedMemory.type}</Badge>
                        )}
                        {selectedMemory.category && (
                          <Badge variant="outline">
                            {selectedMemory.category}
                          </Badge>
                        )}
                        {selectedMemory.importance && (
                          <Badge variant="outline">
                            Importance: {selectedMemory.importance}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Level 2: Search-friendly Brief */}
                {selectedMemory.description && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <h3 className="text-lg font-medium">Overview</h3>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
                        {selectedMemory.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Level 3: Valuable Content & Results */}
                {selectedMemory.summary && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <h3 className="text-lg font-medium">Valuable Content</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Key results & information
                      </span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="text-sm leading-relaxed text-green-900 dark:text-green-100 whitespace-pre-wrap">
                        {selectedMemory.summary}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Topics and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedMemory.keyTopics &&
                    selectedMemory.keyTopics.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Key Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMemory.keyTopics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMemory.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversation Brief for conversation type memories */}
                {selectedMemory.type === 'conversation' &&
                  Array.isArray(selectedMemory.content) &&
                  selectedMemory.content.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <h3 className="text-lg font-medium">
                          Conversation Brief
                        </h3>
                        <Badge variant="outline">
                          {selectedMemory.content.length} messages
                        </Badge>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-purple-900 dark:text-purple-100">
                                Messages:
                              </span>
                              <span className="ml-2 text-purple-700 dark:text-purple-300">
                                {selectedMemory.content.length}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-purple-900 dark:text-purple-100">
                                Participants:
                              </span>
                              <span className="ml-2 text-purple-700 dark:text-purple-300">
                                {
                                  new Set(
                                    (
                                      selectedMemory.content as ConversationMessage[]
                                    ).map((m) => m.role)
                                  ).size
                                }
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-purple-900 dark:text-purple-100">
                                Duration:
                              </span>
                              <span className="ml-2 text-purple-700 dark:text-purple-300">
                                {(() => {
                                  const messages =
                                    selectedMemory.content as ConversationMessage[]
                                  const firstMsg = messages[0]?.timestamp
                                  const lastMsg =
                                    messages[messages.length - 1]?.timestamp
                                  if (firstMsg && lastMsg) {
                                    const duration =
                                      new Date(lastMsg).getTime() -
                                      new Date(firstMsg).getTime()
                                    const minutes = Math.round(duration / 60000)
                                    return minutes > 0
                                      ? `${minutes}min`
                                      : '<1min'
                                  }
                                  return 'Unknown'
                                })()}
                              </span>
                            </div>
                          </div>

                          {selectedMemory.summary ? (
                            <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed">
                              This conversation has been summarized above in the
                              detailed summary section.
                            </p>
                          ) : (
                            <p className="text-sm text-purple-700 dark:text-purple-300 italic">
                              Conversation summary is being generated...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Footer info */}
                {selectedMemory.lastAccessedAt && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last accessed:{' '}
                      {new Date(selectedMemory.lastAccessedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Brain className="w-12 h-12 text-muted-foreground/50" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Select a memory to explore
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a memory from the list to view its details, summary,
                    and key information
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
