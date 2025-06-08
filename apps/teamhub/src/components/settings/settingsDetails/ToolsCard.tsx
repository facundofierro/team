'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Settings2, Search } from 'lucide-react'
import { ToolType, ToolWithTypes, OrganizationSettings } from '@teamhub/db'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

type ToolCardProps = {
  tools: ToolWithTypes[]
  toolTypes: ToolType[]
  organizationId: string
  onChange: (tools: ToolWithTypes[]) => void
  onSave?: (settings: OrganizationSettings) => Promise<void>
  allSettings?: OrganizationSettings
}

type AddToolSheetProps = {
  isOpen: boolean
  onClose: () => void
  toolTypes: ToolType[]
  organizationId: string
  onAdd: (tool: Partial<ToolWithTypes>) => void
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

function AddToolSheet({
  isOpen,
  onClose,
  toolTypes,
  organizationId,
  onAdd,
}: AddToolSheetProps) {
  const [selectedType, setSelectedType] = useState<ToolType | null>(null)
  const [name, setName] = useState('')
  const [config, setConfig] = useState<Record<string, string>>({})
  const [isManaged, setIsManaged] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and limit tool types based on search
  const filteredToolTypes = useMemo(() => {
    const filtered = toolTypes.filter(
      (type) =>
        type.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (type.description &&
          type.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    return filtered.slice(0, 10) // Limit to 10 items for better UX
  }, [toolTypes, searchQuery])

  const handleSubmit = async () => {
    if (!selectedType) return
    if (!name.trim()) return

    let finalConfig = config

    // If it's a managed tool, get the configuration from environment variables
    if (isManaged && selectedType.canBeManaged) {
      const managedConfig = await getManagedToolConfiguration(selectedType.type)
      finalConfig = { ...config, ...managedConfig }
    }

    const toolData = {
      id: crypto.randomUUID(),
      type: selectedType.type,
      name,
      description: selectedType.description || '',
      configuration: finalConfig,
      schema: {}, // We'll need to define this based on the tool type
      metadata: {},
      version: '1.0.0',
      isActive: true,
      isManaged,
      organizationId,
      createdAt: new Date(),
    }

    onAdd(toolData)
    onClose()

    // Reset form
    setSelectedType(null)
    setName('')
    setConfig({})
    setIsManaged(false)
    setSearchQuery('')
  }

  const handleCancel = () => {
    onClose()
    setSelectedType(null)
    setName('')
    setConfig({})
    setIsManaged(false)
    setSearchQuery('')
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Add Tool</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Search for tool types */}
          <div className="grid gap-2">
            <Label>Search Tool Types</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tool type selection */}
          <div className="grid gap-2">
            <Label>Select Tool Type</Label>
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-2">
                {filteredToolTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      'p-3 border rounded-md cursor-pointer transition-colors',
                      selectedType?.id === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => setSelectedType(type)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{type.type}</h4>
                        {type.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        )}
                      </div>
                      {type.canBeManaged && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Manageable
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {filteredToolTypes.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No tool types found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Tool name */}
          {selectedType && (
            <div className="grid gap-2">
              <Label>Tool Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter name for ${selectedType.type} tool`}
              />
            </div>
          )}

          {/* Managed Tool Option */}
          {selectedType?.canBeManaged && (
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="managed"
                  checked={isManaged}
                  onChange={(e) => setIsManaged(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <Label htmlFor="managed">Use Managed Tool</Label>
              </div>
              {selectedType.managedPriceDescription && (
                <p className="text-sm text-muted-foreground">
                  {selectedType.managedPriceDescription}
                </p>
              )}
              {isManaged && (
                <p className="text-sm text-blue-600">
                  Managed tools will use environment variables for
                  configuration.
                </p>
              )}
            </div>
          )}

          {/* Configuration Parameters - Only show if NOT managed */}
          {!!selectedType?.configurationParams &&
            Object.keys(selectedType.configurationParams).length > 0 &&
            !isManaged && (
              <div className="grid gap-4">
                <Label>Configuration</Label>
                {Object.entries(selectedType.configurationParams).map(
                  ([key, param]) => (
                    <div key={key} className="grid gap-2">
                      <Label>{param.description || key}</Label>
                      <Input
                        type={param.type || 'text'}
                        value={config[key] || ''}
                        onChange={(e) =>
                          setConfig((prev) => ({
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
              onClick={handleSubmit}
              disabled={!selectedType || !name.trim()}
            >
              Add Tool
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

export function ToolsCard({
  tools,
  toolTypes,
  organizationId,
  onChange,
  onSave,
  allSettings,
}: ToolCardProps) {
  const [isAddingTool, setIsAddingTool] = useState(false)

  const handleAddTool = async (newTool: Partial<ToolWithTypes>) => {
    // Add the tool to the local state immediately for UI responsiveness
    const updatedTools = [...tools, newTool as ToolWithTypes]

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
        // Still update local state so user sees the tool was added
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
        // Still update local state so user sees the tool was removed
      }
    }

    onChange(updatedTools)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Tools</CardTitle>
        <Button onClick={() => setIsAddingTool(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No tools configured. Add your first tool to get started.
                </TableCell>
              </TableRow>
            ) : (
              tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.description}</TableCell>
                  <TableCell className="capitalize">{tool.type}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tool.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {tool.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                        title="Configure tool"
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        title="Remove tool"
                        onClick={() => handleRemoveTool(tool.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <AddToolSheet
        isOpen={isAddingTool}
        onClose={() => setIsAddingTool(false)}
        toolTypes={toolTypes}
        organizationId={organizationId}
        onAdd={handleAddTool}
      />
    </Card>
  )
}
