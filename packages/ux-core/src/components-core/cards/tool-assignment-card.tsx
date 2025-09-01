'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import {
  ConfigurationCard,
  ConfigButton,
  ToolAssignmentItem,
} from '../configuration-cards'
import { Plus } from 'lucide-react'

export interface ToolAssignmentCardProps {
  tools: Array<{
    id: string
    name: string
    description: string
    type: string
    enabled: boolean
  }>
  onAddTool?: () => void
  onToggleTool?: (id: string, enabled: boolean) => void
  onRemoveTool?: (id: string) => void
  className?: string
}

export function ToolAssignmentCard({
  tools,
  onAddTool,
  onToggleTool,
  onRemoveTool,
  className,
}: ToolAssignmentCardProps) {
  return (
    <ConfigurationCard
      title="Tool Assignment"
      headerAction={
        <ConfigButton
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onAddTool}
        >
          Add Tool
        </ConfigButton>
      }
      className={className}
    >
      <div className="space-y-2">
        {tools.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tools assigned yet.</p>
            <p className="text-xs mt-1">
              Click "Add Tool" to assign tools to this agent.
            </p>
          </div>
        ) : (
          tools.map((tool) => (
            <ToolAssignmentItem
              key={tool.id}
              {...tool}
              onToggle={(enabled) => onToggleTool?.(tool.id, enabled)}
              onRemove={() => onRemoveTool?.(tool.id)}
            />
          ))
        )}
      </div>
    </ConfigurationCard>
  )
}
