'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { ToolType, ToolWithTypes, OrganizationSettings } from '@agelum/db'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToolCarousel } from './ToolsCard/ToolCarousel'
import { AvailableToolsGrid } from './ToolsCard/AvailableToolsGrid'
import { ToolConfigurationSheet } from './ToolsCard/ToolConfigurationSheet'
import { CurrentToolsList } from './ToolsCard/CurrentToolsList'
import { MCPToolsSection } from './ToolsCard/MCPToolsSection'

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

  const handleSaveTool = async (updatedTool: ToolWithTypes) => {
    const updatedTools = tools.map((tool) =>
      tool.id === updatedTool.id ? updatedTool : tool
    )

    // If we have onSave and allSettings, save directly to database
    if (onSave && allSettings) {
      try {
        const updatedSettings = {
          ...allSettings,
          tools: updatedTools,
        }
        await onSave(updatedSettings)
      } catch (error) {
        console.error('Error updating tool in database:', error)
      }
    }

    onChange(updatedTools)
  }

  return (
    <>
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
                {/* Featured Tool Carousel - First */}
                {availableToolTypes.length > 0 && (
                  <div>
                    <ToolCarousel
                      toolTypes={availableToolTypes.slice(0, 5)}
                      onAddTool={handleAddTool}
                    />
                  </div>
                )}

                {/* MCP Tools Section - Second */}
                <MCPToolsSection
                  tools={tools}
                  toolTypes={toolTypes}
                  onAddTool={handleAddTool}
                  onConfigureTool={setConfigTool}
                  onRemoveTool={handleRemoveTool}
                />

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
                          All available tools have been added to your
                          collection.
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

      {/* Tool Configuration Sheet */}
      <ToolConfigurationSheet
        tool={configTool}
        isOpen={configTool !== null}
        onClose={() => setConfigTool(null)}
        onSave={handleSaveTool}
        toolTypes={toolTypes}
      />
    </>
  )
}
