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

    const toolData = {
      id: crypto.randomUUID(),
      type: selectedType.type,
      name,
      description: selectedType.description || '',
      configuration: config,
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
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent className="sm:max-w-[400px] w-3/4">
        <SheetHeader>
          <SheetTitle>Add New Tool</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Tool Type Selection */}
          <div className="grid gap-2">
            <Label>Tool Type</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tool types..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] w-full border rounded-md">
              <div className="p-2">
                {filteredToolTypes.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    {searchQuery
                      ? 'No tool types found matching your search.'
                      : 'No tool types available.'}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredToolTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'w-full text-left p-3 rounded-md border transition-colors',
                          selectedType?.type === type.type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-muted'
                        )}
                      >
                        <div className="font-medium">{type.type}</div>
                        {type.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </div>
                        )}
                        {type.canBeManaged && (
                          <div className="text-xs mt-1 opacity-70">
                            • Can be managed
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {searchQuery && filteredToolTypes.length >= 10 && (
              <div className="text-xs text-muted-foreground">
                Showing first 10 results. Refine your search for more specific
                results.
              </div>
            )}
          </div>

          {/* Tool Name */}
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
            </div>
          )}

          {/* Configuration Parameters */}
          {!!selectedType?.configurationParams &&
            Object.keys(selectedType.configurationParams).length > 0 && (
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
    <Card className="h-full bg-cardLight">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tools</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {onSave && allSettings
              ? 'Tools are automatically saved when added or removed'
              : 'Remember to save changes after adding or removing tools'}
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddingTool(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
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
