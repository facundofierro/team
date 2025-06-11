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
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { MemoryWithTypes, ConversationMessage } from '@teamhub/db'
import ReactMarkdown from 'react-markdown'

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
  const [regenerating, setRegenerating] = useState(false)
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

  // Function to regenerate memory content
  const regenerateMemoryContent = async () => {
    if (!selectedMemory || !currentOrganization?.id) {
      console.error('Cannot regenerate: missing memory or organization')
      return
    }

    setRegenerating(true)
    try {
      console.log('🔄 Starting memory regeneration for:', selectedMemory.id)

      const response = await fetch(
        `/api/agents/${agentId}/memories/${selectedMemory.id}/regenerate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            organizationId: currentOrganization.id,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Failed to regenerate memory content'
        )
      }

      const data = await response.json()
      console.log('✅ Memory regeneration successful:', data)

      // Update the local memories state with the updated memory
      setMemories((prevMemories) =>
        prevMemories.map((mem) =>
          mem.id === selectedMemory.id ? data.memory : mem
        )
      )

      // Show success message (you could add a toast notification here)
      console.log('🎉 Memory content regenerated successfully!')
    } catch (error) {
      console.error('❌ Failed to regenerate memory content:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to regenerate memory content'
      )
    } finally {
      setRegenerating(false)
    }
  }

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
                      ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700'
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

                    {/* Show legend for active conversations or description for others */}
                    {memory.type === 'conversation' && memory.isActive ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-3 h-3" />
                          <span>
                            {Array.isArray(memory.content)
                              ? memory.content.length
                              : 0}{' '}
                            messages
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="font-medium text-xs">Active</span>
                        </div>
                      </div>
                    ) : memory.description ? (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 h-8 w-full break-words">
                        {memory.description}
                      </p>
                    ) : null}
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
                    <Brain className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
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
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <p className="text-base leading-relaxed text-orange-900 dark:text-orange-100 font-['Tiempos_Text']">
                      {selectedMemory.description}
                    </p>
                  </div>
                )}

                {/* Level 3: Valuable Content & Results */}
                {selectedMemory.summary && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <h3 className="text-lg font-medium">Summary</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Key results & information
                      </span>
                    </div>
                    <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      <ReactMarkdown
                        components={{
                          // Custom link component
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline hover:no-underline transition-colors text-xs"
                            >
                              {children}
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          ),
                          // Custom paragraph styling
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0">{children}</p>
                          ),
                          // Custom list styling
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="ml-2">{children}</li>
                          ),
                          // Custom bold text styling
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-800 dark:text-gray-200">
                              {children}
                            </strong>
                          ),
                          // Custom italic text styling
                          em: ({ children }) => (
                            <em className="italic text-gray-700 dark:text-gray-300">
                              {children}
                            </em>
                          ),
                          // Custom code styling
                          code: ({ children }) => (
                            <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          // Custom code block styling
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-3">
                              {children}
                            </pre>
                          ),
                          // Custom heading styling
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-bold mb-2 text-gray-800 dark:text-gray-200">
                              {children}
                            </h3>
                          ),
                          // Custom blockquote styling
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-orange-300 pl-4 italic mb-3 text-gray-600 dark:text-gray-400">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {(() => {
                          if (!selectedMemory.summary) return ''

                          // Convert plain text URLs to markdown links before processing
                          const urlRegex = /(https?:\/\/[^\s\)]+)/g
                          return selectedMemory.summary.replace(
                            urlRegex,
                            (url) => {
                              // Only convert if it's not already a markdown link
                              const beforeUrl =
                                selectedMemory.summary!.substring(
                                  0,
                                  selectedMemory.summary!.indexOf(url)
                                )
                              if (beforeUrl.endsWith('](')) {
                                return url // Already a markdown link
                              }
                              return `[${url}](${url})`
                            }
                          )
                        })()}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Key Topics and Tags */}
                <div className="space-y-6">
                  {selectedMemory.keyTopics &&
                    selectedMemory.keyTopics.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Eye className="w-4 h-4 text-orange-600" />
                          Key Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMemory.keyTopics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
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
                        <MessageCircle className="w-4 h-4 text-orange-600" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMemory.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
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
                        <MessageCircle className="w-4 h-4 text-orange-600" />
                        <h3 className="text-lg font-medium">
                          Conversation Brief
                        </h3>
                        <Badge variant="outline">
                          {selectedMemory.content.length} messages
                        </Badge>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                Messages:
                              </span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {selectedMemory.content.length}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                Participants:
                              </span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
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
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                Duration:
                              </span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
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
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              The valuable content and results from this
                              conversation are available above in the Summary
                              section.
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                              Summary generation is being processed...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Regenerate button */}
                {selectedMemory.type === 'conversation' && (
                  <div className="pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={regenerateMemoryContent}
                      disabled={regenerating}
                    >
                      {regenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Regenerating...
                        </>
                      ) : (
                        'Regenerate Overview & Content'
                      )}
                    </Button>
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
