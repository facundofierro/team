'use client'

import React, { useState, useEffect } from 'react'
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
import { MCPDiscoveryService, type MCPServerListing } from '@teamhub/ai'

interface MCPDiscoveryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectMCP: (mcp: MCPServerListing) => void
}

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

  // Load initial popular MCPs
  useEffect(() => {
    if (isOpen) {
      loadMCPs()
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      loadMCPs()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, isOpen])

  const loadMCPs = async () => {
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

      const result = await response.json()

      if (result.success) {
        setMcpServers(result.servers)
        setTotalFound(result.totalFound)
        setSearchedSources(result.sources)
      } else {
        console.error('MCP discovery failed:', result.message)
        // Fallback to popular MCPs
        setMcpServers(
          MCPDiscoveryService.getPopularMCPs(
            selectedCategory === 'all' ? undefined : selectedCategory
          )
        )
        setTotalFound(mcpServers.length)
        setSearchedSources(['registry'])
      }
    } catch (error) {
      console.error('Error loading MCPs:', error)
      // Fallback to popular MCPs
      setMcpServers(
        MCPDiscoveryService.getPopularMCPs(
          selectedCategory === 'all' ? undefined : selectedCategory
        )
      )
      setTotalFound(mcpServers.length)
      setSearchedSources(['registry'])
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'development', label: 'Development' },
    { value: 'data', label: 'Data & Database' },
    { value: 'communication', label: 'Communication' },
    { value: 'productivity', label: 'Productivity' },
  ]

  const handleSelectMCP = (mcp: MCPServerListing) => {
    onSelectMCP(mcp)
    onClose()
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

  const getSourceIcon = (sources: string[]) => {
    if (sources.includes('github')) return '🐙'
    if (sources.includes('npm')) return '📦'
    return '📚'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Browse MCP Registry</DialogTitle>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover Model Context Protocol servers from multiple sources
            </p>
            <div className="text-xs bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                💡 About MCP Servers:
              </div>
              <div className="text-blue-700 dark:text-blue-300 space-y-1">
                <div>
                  • <strong>📦 Local Install</strong> - Download & run on your
                  machine (recommended for security)
                </div>
                <div>
                  • <strong>🏠 Local Server</strong> - Run locally after
                  installation (secure & private)
                </div>
                <div>
                  • <strong>🌐 Remote Server</strong> - External services
                  (consider privacy implications)
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
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
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sources Info */}
          {searchedSources.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Sources:</span>
              {searchedSources.map((source) => (
                <Badge key={source} variant="outline" className="text-xs">
                  {source === 'registry' && '📚 Registry'}
                  {source === 'github' && '🐙 GitHub'}
                  {source === 'npm' && '📦 NPM'}
                </Badge>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                  {mcpServers.map((mcp, index) => (
                    <Card
                      key={`${mcp.name}-${index}`}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectMCP(mcp)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getCategoryIcon(mcp.category)}
                            </span>
                            <CardTitle className="text-base">
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
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {mcp.description}
                        </p>
                        <div className="space-y-2">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                            {mcp.url}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>
                              by {mcp.author} • v{mcp.version}
                            </span>
                            {mcp.tags?.includes('github') && <span>🐙</span>}
                            {mcp.tags?.includes('npm') && <span>📦</span>}
                          </div>
                          {mcp.requirements && mcp.requirements.length > 0 && (
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-2 border-t">
            Showing {mcpServers.length} of {totalFound} MCP servers
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
