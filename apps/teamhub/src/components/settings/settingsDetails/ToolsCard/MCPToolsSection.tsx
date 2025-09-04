'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ToolType, ToolWithTypes } from '@agelum/db'
import { MCPDiscoveryDialog } from './MCPDiscoveryDialog'

interface MCPToolsSectionProps {
  tools: ToolWithTypes[]
  toolTypes: ToolType[]
  onAddTool: (toolType: ToolType) => void
  onConfigureTool: (tool: ToolWithTypes) => void
  onRemoveTool: (toolId: string) => void
}

interface MCPServerConfig {
  serverUrl: string
  authToken?: string
  timeout?: string
  protocol?: string
}

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

export function MCPToolsSection({
  tools,
  toolTypes,
  onAddTool,
  onConfigureTool,
  onRemoveTool,
}: MCPToolsSectionProps) {
  const [showMCPForm, setShowMCPForm] = useState(false)
  const [showDiscoveryDialog, setShowDiscoveryDialog] = useState(false)
  const [mcpConfig, setMCPConfig] = useState<MCPServerConfig>({
    serverUrl: '',
    authToken: '',
    timeout: '30000',
    protocol: 'http',
  })

  // Find MCP-related tools
  const mcpConnectorType = toolTypes.find((t) => t.type === 'mcpConnector')
  const mcpTools = tools.filter((t) => t.type === 'mcpConnector')

  const handleAddMCPConnector = () => {
    if (!mcpConnectorType) return

    // Add the MCP connector with the specified configuration
    const toolTypeWithConfig = {
      ...mcpConnectorType,
      defaultConfiguration: {
        MCP_SERVER_URL: mcpConfig.serverUrl,
        MCP_AUTH_TOKEN: mcpConfig.authToken || '',
        MCP_TIMEOUT: mcpConfig.timeout || '30000',
        MCP_PROTOCOL: mcpConfig.protocol || 'http',
      },
    }

    onAddTool(toolTypeWithConfig)
    setShowMCPForm(false)
    setMCPConfig({
      serverUrl: '',
      authToken: '',
      timeout: '30000',
      protocol: 'http',
    })
  }

  const handleDiscoverMCPs = () => {
    setShowDiscoveryDialog(true)
  }

  const handleSelectMCP = (mcp: MCPServerListing) => {
    // Auto-fill the connection form with selected MCP
    setMCPConfig({
      serverUrl: mcp.url,
      authToken: '',
      timeout: '30000',
      protocol: mcp.url.startsWith('wss://') ? 'websocket' : 'http',
    })
    setShowMCPForm(true)
    setShowDiscoveryDialog(false)
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              🔌 Model Context Protocol (MCP)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Connect to external MCP servers to extend your agent capabilities
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current MCP Tools */}
        {mcpTools.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Active MCP Connections</h4>
            <div className="space-y-2">
              {mcpTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tool.name}</span>
                      <Badge
                        variant={tool.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tool.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {tool.type === 'mcpConnector' && (
                        <Badge variant="outline" className="text-xs">
                          Connector
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.type === 'mcpConnector' &&
                      tool.configuration?.MCP_SERVER_URL
                        ? `Connected to: ${tool.configuration.MCP_SERVER_URL}`
                        : tool.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onConfigureTool(tool)}
                    >
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveTool(tool.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {/* MCP Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add MCP Server */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Connect MCP Server</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manually connect to any MCP server by providing its URL, or{' '}
                <button
                  onClick={handleDiscoverMCPs}
                  className="text-gray-700 hover:text-gray-900 underline"
                >
                  browse the registry
                </button>{' '}
                for popular servers
              </p>
            </CardHeader>
            <CardContent>
              {!showMCPForm ? (
                <Button
                  onClick={() => setShowMCPForm(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={!mcpConnectorType}
                >
                  Add MCP Server
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="serverUrl" className="text-sm">
                      Server URL *
                    </Label>
                    <Input
                      id="serverUrl"
                      placeholder="http://localhost:3000 or wss://mcp-server.com"
                      value={mcpConfig.serverUrl}
                      onChange={(e) =>
                        setMCPConfig({
                          ...mcpConfig,
                          serverUrl: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authToken" className="text-sm">
                      Auth Token (optional)
                    </Label>
                    <Input
                      id="authToken"
                      placeholder="Bearer token if required"
                      value={mcpConfig.authToken}
                      onChange={(e) =>
                        setMCPConfig({
                          ...mcpConfig,
                          authToken: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddMCPConnector}
                      disabled={!mcpConfig.serverUrl.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Connect
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowMCPForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discover MCPs */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Discover MCPs</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse popular MCP servers and find new capabilities
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDiscoverMCPs}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Browse MCP Registry
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* MCP Discovery Dialog */}
        <MCPDiscoveryDialog
          isOpen={showDiscoveryDialog}
          onClose={() => setShowDiscoveryDialog(false)}
          onSelectMCP={handleSelectMCP}
        />
      </CardContent>
    </Card>
  )
}
