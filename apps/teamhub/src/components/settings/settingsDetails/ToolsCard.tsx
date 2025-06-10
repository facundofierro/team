'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Trash2,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { ToolType, ToolWithTypes, OrganizationSettings } from '@teamhub/db'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import * as React from 'react'

type ToolCardProps = {
  tools: ToolWithTypes[]
  toolTypes: ToolType[]
  organizationId: string
  onChange: (tools: ToolWithTypes[]) => void
  onSave?: (settings: OrganizationSettings) => Promise<void>
  allSettings?: OrganizationSettings
}

// Helper function to get managed tool configuration
async function getManagedToolConfiguration(
  toolType: string
): Promise<Record<string, string>> {
  try {
    const response = await fetch(`/api/tools/managed-config?type=${toolType}`)
    if (response.ok) {
      const data = await response.json()
      return data.configuration || {}
    }
  } catch (error) {
    console.warn('Failed to get managed tool configuration:', error)
  }
  return {}
}

function ToolCarousel({
  toolTypes,
  onAddTool,
}: {
  toolTypes: ToolType[]
  onAddTool: (toolType: ToolType) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTool = () => {
    setCurrentIndex((prev) => (prev + 1) % toolTypes.length)
  }

  const prevTool = () => {
    setCurrentIndex((prev) => (prev - 1 + toolTypes.length) % toolTypes.length)
  }

  if (toolTypes.length === 0) {
    return (
      <Card className="h-64">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No tools available</p>
        </CardContent>
      </Card>
    )
  }

  const currentTool = toolTypes[currentIndex]

  return (
    <Card className="h-64 relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{currentTool.type}</h3>
              {currentTool.canBeManaged && (
                <Badge variant="secondary" className="mb-2">
                  Managed Available
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTool}
                disabled={toolTypes.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTool}
                disabled={toolTypes.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
            {currentTool.description || 'No description available'}
          </p>

          {currentTool.managedPriceDescription && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
              {currentTool.managedPriceDescription}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {toolTypes.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>

          <Button
            onClick={() => onAddTool(currentTool)}
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tool
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AvailableToolsGrid({
  toolTypes,
  onAddTool,
}: {
  toolTypes: ToolType[]
  onAddTool: (toolType: ToolType) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {toolTypes.map((toolType) => (
        <Card
          key={toolType.id}
          className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{toolType.type}</CardTitle>
              {toolType.canBeManaged && (
                <Badge variant="secondary" className="text-xs">
                  Managed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {toolType.description || 'No description available'}
            </p>

            {toolType.managedPriceDescription && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                {toolType.managedPriceDescription}
              </p>
            )}

            <Button
              onClick={() => onAddTool(toolType)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

type ToolConfigurationSheetProps = {
  tool: ToolWithTypes | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTool: ToolWithTypes) => void
  toolTypes: ToolType[]
}

function ToolConfigurationSheet({
  tool,
  isOpen,
  onClose,
  onSave,
  toolTypes,
}: ToolConfigurationSheetProps) {
  const [name, setName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isManaged, setIsManaged] = useState(false)
  const [configuration, setConfiguration] = useState<Record<string, string>>({})

  // Find the corresponding tool type
  const toolType = toolTypes.find((type) => type.type === tool?.type)

  // Initialize form when tool changes
  React.useEffect(() => {
    if (tool) {
      setName(tool.name)
      setIsActive(tool.isActive ?? true)
      setIsManaged(tool.isManaged ?? false)
      setConfiguration(tool.configuration)
    }
  }, [tool])

  const handleSave = async () => {
    if (!tool) return

    let finalConfiguration = configuration

    // If switching to managed, get managed configuration
    if (isManaged && toolType?.canBeManaged) {
      const managedConfig = await getManagedToolConfiguration(tool.type)
      finalConfiguration = { ...configuration, ...managedConfig }
    }

    const updatedTool: ToolWithTypes = {
      ...tool,
      name,
      isActive,
      isManaged,
      configuration: finalConfiguration,
    }

    onSave(updatedTool)
    onClose()
  }

  const handleCancel = () => {
    if (tool) {
      setName(tool.name)
      setIsActive(tool.isActive ?? true)
      setIsManaged(tool.isManaged ?? false)
      setConfiguration(tool.configuration)
    }
    onClose()
  }

  if (!tool) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Configure Tool: {tool.type}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Tool name */}
          <div className="grid gap-2">
            <Label htmlFor="tool-name">Tool Name</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tool name"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="tool-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="tool-active">Tool is active</Label>
          </div>

          {/* Managed toggle (only if tool type supports it) */}
          {toolType?.canBeManaged && (
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tool-managed"
                  checked={isManaged}
                  onCheckedChange={setIsManaged}
                />
                <Label htmlFor="tool-managed">Use Managed Configuration</Label>
              </div>
              {toolType.managedPriceDescription && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {toolType.managedPriceDescription}
                </p>
              )}
              {isManaged && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Managed tools use environment variables for configuration.
                </p>
              )}
            </div>
          )}

          {/* Configuration Parameters (only show if NOT managed) */}
          {toolType?.configurationParams &&
            Object.keys(toolType.configurationParams).length > 0 &&
            !isManaged && (
              <div className="grid gap-4">
                <Label className="text-base font-medium">Configuration</Label>
                {Object.entries(toolType.configurationParams).map(
                  ([key, param]) => (
                    <div key={key} className="grid gap-2">
                      <Label htmlFor={`config-${key}`}>
                        {param.description || key}
                      </Label>
                      <Input
                        id={`config-${key}`}
                        type={param.type || 'text'}
                        value={configuration[key] || ''}
                        onChange={(e) =>
                          setConfiguration((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  )
                )}
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CurrentToolsList({
  tools,
  onRemoveTool,
  onConfigureTool,
}: {
  tools: ToolWithTypes[]
  onRemoveTool: (toolId: string) => void
  onConfigureTool: (tool: ToolWithTypes) => void
}) {
  // Sort tools by createdAt date (newest first)
  const sortedTools = [...tools].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA // Sort descending (newest first)
  })

  const formatAddedDate = (date: Date) => {
    const now = new Date()
    const diffInHours =
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">My Tools</CardTitle>
          {sortedTools.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {sortedTools.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="p-4 space-y-3">
            {sortedTools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No tools added yet. Browse available tools to get started.
                </p>
              </div>
            ) : (
              sortedTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {tool.name}
                        </h4>
                        {tool.createdAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatAddedDate(tool.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {tool.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          • {tool.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {tool.isManaged && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • Managed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                        title="Configure tool"
                        onClick={() => onConfigureTool(tool)}
                      >
                        <Settings2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        title="Remove tool"
                        onClick={() => onRemoveTool(tool.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function ToolsCard({
  tools,
  toolTypes,
  organizationId,
  onChange,
  onSave,
  allSettings,
}: ToolCardProps) {
  const [configTool, setConfigTool] = useState<ToolWithTypes | null>(null)

  // Filter out tool types that are already added
  const availableToolTypes = useMemo(() => {
    const addedToolTypes = new Set(tools.map((tool) => tool.type))
    return toolTypes.filter((toolType) => !addedToolTypes.has(toolType.type))
  }, [tools, toolTypes])

  const handleAddTool = async (toolType: ToolType) => {
    // Create tool with managed configuration if available
    const isManaged = toolType.canBeManaged
    let configuration = {}

    if (isManaged) {
      configuration = await getManagedToolConfiguration(toolType.type)
    }

    // Generate unique name by checking existing tool names
    const generateUniqueName = (baseName: string): string => {
      const existingNames = new Set(
        tools.map((tool) => tool.name.toLowerCase())
      )

      // If base name doesn't exist, use it
      if (!existingNames.has(baseName.toLowerCase())) {
        return baseName
      }

      // Find the next available number
      let counter = 1
      let uniqueName = `${baseName}${counter}`

      while (existingNames.has(uniqueName.toLowerCase())) {
        counter++
        uniqueName = `${baseName}${counter}`
      }

      return uniqueName
    }

    const uniqueName = generateUniqueName(toolType.type)

    const newTool: ToolWithTypes = {
      id: crypto.randomUUID(),
      type: toolType.type,
      name: uniqueName, // Use the unique generated name
      description: toolType.description || '',
      configuration,
      schema: {},
      metadata: {},
      version: '1.0.0',
      isActive: true,
      isManaged,
      organizationId,
      createdAt: new Date(),
    }

    const updatedTools = [...tools, newTool]

    // If we have onSave and allSettings, save directly to database
    if (onSave && allSettings) {
      try {
        const updatedSettings = {
          ...allSettings,
          tools: updatedTools,
        }
        await onSave(updatedSettings)
      } catch (error) {
        console.error('Error saving tool to database:', error)
      }
    }

    onChange(updatedTools)
  }

  const handleRemoveTool = async (toolId: string) => {
    const updatedTools = tools.filter((tool) => tool.id !== toolId)

    // If we have onSave and allSettings, save directly to database
    if (onSave && allSettings) {
      try {
        const updatedSettings = {
          ...allSettings,
          tools: updatedTools,
        }
        await onSave(updatedSettings)
      } catch (error) {
        console.error('Error removing tool from database:', error)
      }
    }

    onChange(updatedTools)
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left Panel - Current Tools (1/4 width) */}
      <div className="w-1/4 min-w-[280px]">
        <CurrentToolsList
          tools={tools}
          onRemoveTool={handleRemoveTool}
          onConfigureTool={setConfigTool}
        />
      </div>

      {/* Right Panel - Available Tools Marketplace (3/4 width) */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {/* Featured Tool Carousel */}
              {availableToolTypes.length > 0 && (
                <div>
                  <ToolCarousel
                    toolTypes={availableToolTypes.slice(0, 5)}
                    onAddTool={handleAddTool}
                  />
                </div>
              )}

              {/* All Available Tools Grid */}
              <div className="pb-6">
                {availableToolTypes.length > 0 ? (
                  <AvailableToolsGrid
                    toolTypes={availableToolTypes}
                    onAddTool={handleAddTool}
                  />
                ) : (
                  <Card className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        All available tools have been added to your collection.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
