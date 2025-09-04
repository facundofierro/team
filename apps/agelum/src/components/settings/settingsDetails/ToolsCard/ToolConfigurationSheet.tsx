import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ToolType, ToolWithTypes } from '@agelum/db'
import { ConfigurationParameters } from './ConfigurationParameters'

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

interface ToolConfigurationSheetProps {
  tool: ToolWithTypes | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTool: ToolWithTypes) => void
  toolTypes: ToolType[]
}

export function ToolConfigurationSheet({
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
          <div className="grid gap-2">
            <Label htmlFor="tool-name">Tool Name</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tool name"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="tool-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="tool-active">Tool is active</Label>
            </div>
          </div>

          <div className="grid gap-2">
            {toolType?.canBeManaged && (
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tool-managed"
                    checked={isManaged}
                    onCheckedChange={setIsManaged}
                  />
                  <Label htmlFor="tool-managed">
                    Use Managed Configuration
                  </Label>
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
          </div>

          <div className="grid gap-4">
            <ConfigurationParameters
              toolType={toolType}
              isManaged={isManaged}
              configuration={configuration}
              setConfiguration={setConfiguration}
            />
          </div>

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
