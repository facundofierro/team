'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganizationStore } from '@/stores/organizationStore'

// Local types to avoid importing server-side code
type MCPServerListing = {
  name: string
  description: string
  url: string
  category: string
  author: string
  version?: string
  stars?: number
  lastUpdated?: string
  documentation?: string
  examples?: Array<{
    name: string
    description: string
    url?: string
  }>
  installInstructions?: string
  requirements?: string[]
  tags?: string[]
}

type MCPDiscoveryResult = {
  success: boolean
  query?: string
  totalFound: number
  servers: MCPServerListing[]
  sources: string[]
  message: string
}

interface MCPDiscoveryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectMCP: (mcp: MCPServerListing) => void
}

// Fallback popular MCPs to avoid importing server-side code
const FALLBACK_POPULAR_MCPS: MCPServerListing[] = [
  {
    name: 'File System MCP',
    description:
      'Access and manipulate files and directories on the local filesystem',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    category: 'development',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 1200,
    installInstructions: 'npx @modelcontextprotocol/server-filesystem',
    requirements: ['Node.js 16+'],
    tags: ['filesystem', 'files', 'directories', 'local'],
  },
  {
    name: 'GitHub MCP',
    description:
      'Interact with GitHub repositories, issues, pull requests, and more',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    category: 'development',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 950,
    installInstructions: 'npx @modelcontextprotocol/server-github',
    requirements: ['GitHub personal access token'],
    tags: ['github', 'git', 'repository', 'development'],
  },
  {
    name: 'Web Search MCP',
    description: 'Search the web using various search engines and APIs',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/web-search',
    category: 'productivity',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 800,
    installInstructions: 'npx @modelcontextprotocol/server-web-search',
    requirements: ['API keys for search engines'],
    tags: ['web', 'search', 'research', 'internet'],
  },
]

export function MCPDiscoveryDialog({
  isOpen,
  onClose,
  onSelectMCP,
}: MCPDiscoveryDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [mcpServers, setMcpServers] = useState<MCPServerListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalFound, setTotalFound] = useState(0)
  const [searchedSources, setSearchedSources] = useState<string[]>([])

  const getFilteredFallbackMCPs = useCallback(() => {
    if (selectedCategory === 'all') {
      return FALLBACK_POPULAR_MCPS
    }
    return FALLBACK_POPULAR_MCPS.filter(
      (mcp) => mcp.category === selectedCategory
    )
  }, [selectedCategory])

  const loadMCPs = useCallback(async () => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams({
        ...(searchQuery && { searchQuery }),
        category: selectedCategory,
        source: 'all',
        limit: '50',
      })

      const response = await fetch(`/api/tools/mcp-discovery?${searchParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: MCPDiscoveryResult = await response.json()

      if (result.success) {
        setMcpServers(result.servers)
        setTotalFound(result.totalFound)
        setSearchedSources(result.sources)
      } else {
        console.error('MCP discovery failed:', result.message)
        // Fallback to popular MCPs
        const fallbackMCPs = getFilteredFallbackMCPs()
        setMcpServers(fallbackMCPs)
        setTotalFound(fallbackMCPs.length)
        setSearchedSources(['registry'])
      }
    } catch (error) {
      console.error('Error loading MCPs:', error)
      // Fallback to popular MCPs
      const fallbackMCPs = getFilteredFallbackMCPs()
      setMcpServers(fallbackMCPs)
      setTotalFound(fallbackMCPs.length)
      setSearchedSources(['registry'])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, getFilteredFallbackMCPs])

  // Load initial popular MCPs
  useEffect(() => {
    if (isOpen) {
      loadMCPs()
    }
  }, [isOpen, loadMCPs])

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      loadMCPs()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, isOpen, loadMCPs])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'development', label: 'Development' },
    { value: 'data', label: 'Data & Database' },
    { value: 'communication', label: 'Communication' },
    { value: 'productivity', label: 'Productivity' },
  ]

  const [installingMCP, setInstallingMCP] = useState<string | null>(null)
  const [installationStatus, setInstallationStatus] = useState<
    Record<string, 'success' | 'error' | 'installing'>
  >({})

  // Get current organization from store
  const { currentOrganization } = useOrganizationStore()

  const handleSelectMCP = (mcp: MCPServerListing) => {
    onSelectMCP(mcp)
    onClose()
  }

  const handleInstallMCP = async (
    mcp: MCPServerListing,
    event: React.MouseEvent
  ) => {
    event.stopPropagation() // Prevent triggering the card click

    const mcpName = mcp.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    setInstallingMCP(mcpName)
    setInstallationStatus((prev) => ({ ...prev, [mcpName]: 'installing' }))

    try {
      // Get organization ID from store
      const organizationId = currentOrganization?.id
      if (!organizationId) {
        throw new Error('No organization selected')
      }

      const response = await fetch(
        `/api/organizations/${organizationId}/mcps/install`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: mcpName,
            source: mcp.installInstructions || mcp.url,
            configuration: {
              // Add any default configuration based on MCP type
              ...(mcp.requirements?.includes(
                'GitHub personal access token'
              ) && {
                GITHUB_TOKEN: '', // User will need to configure this
              }),
              ...(mcp.requirements?.includes('API keys for search engines') && {
                SEARCH_API_KEY: '', // User will need to configure this
              }),
            },
          }),
        }
      )

      const result = await response.json()

      if (result.success) {
        setInstallationStatus((prev) => ({ ...prev, [mcpName]: 'success' }))
        console.log(`✅ MCP "${mcp.name}" installed successfully`)
      } else {
        throw new Error(result.message || 'Installation failed')
      }
    } catch (error) {
      console.error(`❌ Failed to install MCP "${mcp.name}":`, error)
      setInstallationStatus((prev) => ({ ...prev, [mcpName]: 'error' }))
    } finally {
      setInstallingMCP(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development':
        return '👨‍💻'
      case 'data':
        return '📊'
      case 'communication':
        return '💬'
      case 'productivity':
        return '⚡'
      default:
        return '🔧'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">Browse MCP Registry</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Discover Model Context Protocol servers from multiple sources
          </p>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 px-6">
          {/* Search and Filters */}
          <div className="flex gap-4 py-4 border-b">
            <div className="flex-1">
              <Input
                placeholder="Search MCPs by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background min-w-[140px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <div className="flex-1 min-h-0 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Searching MCP servers...
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                  {mcpServers.map((mcp, index) => {
                    const mcpName = mcp.name
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '-')
                    const installStatus = installationStatus[mcpName]
                    const isInstalling = installingMCP === mcpName

                    return (
                      <Card
                        key={`${mcp.name}-${index}`}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSelectMCP(mcp)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-lg flex-shrink-0">
                                {getCategoryIcon(mcp.category)}
                              </span>
                              <CardTitle className="text-base break-words hyphens-auto min-w-0">
                                {mcp.name}
                              </CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {mcp.category}
                              </Badge>
                              {mcp.stars && mcp.stars > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  ⭐ {mcp.stars}
                                </Badge>
                              )}
                              {installStatus === 'success' && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-green-600"
                                >
                                  ✅ Installed
                                </Badge>
                              )}
                              {installStatus === 'error' && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  ❌ Failed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {mcp.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span>
                                by {mcp.author} • v{mcp.version}
                              </span>
                              {mcp.tags?.includes('github') && <span>🐙</span>}
                              {mcp.tags?.includes('npm') && <span>📦</span>}
                            </div>
                            {mcp.requirements &&
                              mcp.requirements.length > 0 && (
                                <div className="text-xs text-amber-600">
                                  Requires: {mcp.requirements.join(', ')}
                                </div>
                              )}
                            {/* Installation Type Indicator */}
                            <div className="text-xs flex items-center gap-1">
                              {mcp.url.includes('github.com') ||
                              mcp.url.includes('npmjs.com') ? (
                                <>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    📦 Local Install
                                  </span>
                                  <span className="text-gray-500">
                                    • Runs on your machine
                                  </span>
                                </>
                              ) : mcp.url.includes('localhost') ? (
                                <>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    🏠 Local Server
                                  </span>
                                  <span className="text-gray-500">
                                    • Install & run locally
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    🌐 Remote Server
                                  </span>
                                  <span className="text-gray-500">
                                    • External service
                                  </span>
                                </>
                              )}
                            </div>
                            {mcp.installInstructions && (
                              <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border">
                                <div className="font-medium mb-1">
                                  Installation:
                                </div>
                                <code className="text-gray-700 dark:text-gray-300">
                                  {mcp.installInstructions}
                                </code>
                              </div>
                            )}

                            {/* Install Button */}
                            <div className="mt-3 pt-3 border-t">
                              {installStatus === 'success' ? (
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  ✅ MCP installed successfully!
                                </div>
                              ) : installStatus === 'error' ? (
                                <div className="text-xs text-red-600 dark:text-red-400">
                                  ❌ Installation failed. Click to retry.
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => handleInstallMCP(mcp, e)}
                                  disabled={isInstalling}
                                  className={`w-full px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                                    isInstalling
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                                  }`}
                                >
                                  {isInstalling ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                      Installing...
                                    </div>
                                  ) : (
                                    '🔧 Install MCP'
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-3 border-t bg-gray-50 dark:bg-gray-800/50 -mx-6 px-6">
            <div>
              Showing {mcpServers.length} of {totalFound} MCP servers
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
            {searchedSources.length > 0 && (
              <div className="mt-1 text-xs flex items-center justify-center gap-2">
                <span>Sources:</span>
                {searchedSources.map((source) => (
                  <span
                    key={source}
                    className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                  >
                    {source === 'registry' && '📋 Built-in'}
                    {source === 'github' && '🐙 GitHub'}
                    {source === 'npm' && '📦 npm'}
                  </span>
                ))}
                {!searchedSources.includes('github') && (
                  <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs">
                    🔑 GitHub requires token
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
