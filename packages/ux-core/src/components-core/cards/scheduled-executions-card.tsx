'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import {
  ConfigurationCard,
  ConfigButton,
  ScheduledExecutionItem,
} from '../configuration-cards'
import { Plus } from 'lucide-react'

export interface ScheduledExecutionsCardProps {
  schedules: Array<{
    id: string
    title: string
    description: string
    nextExecution: string
    frequency: string
    status: 'active' | 'inactive' | 'paused'
  }>
  onAddSchedule?: () => void
  onEditSchedule?: (id: string) => void
  onDeleteSchedule?: (id: string) => void
  onToggleSchedule?: (id: string) => void
  className?: string
}

export function ScheduledExecutionsCard({
  schedules,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onToggleSchedule,
  className,
}: ScheduledExecutionsCardProps) {
  return (
    <ConfigurationCard
      title="Scheduled Executions"
      headerAction={
        <ConfigButton
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onAddSchedule}
        >
          Add Schedule
        </ConfigButton>
      }
      className={className}
    >
      <div className="space-y-2">
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No scheduled executions yet.</p>
            <p className="text-xs mt-1">
              Click "Add Schedule" to create your first scheduled task.
            </p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <ScheduledExecutionItem
              key={schedule.id}
              {...schedule}
              onEdit={() => onEditSchedule?.(schedule.id)}
              onDelete={() => onDeleteSchedule?.(schedule.id)}
              onToggle={() => onToggleSchedule?.(schedule.id)}
            />
          ))
        )}
      </div>
    </ConfigurationCard>
  )
}
