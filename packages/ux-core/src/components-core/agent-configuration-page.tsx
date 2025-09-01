'use client'

import React, { useState } from 'react'
import { cn } from '../utils/cn'
import { Button } from '../components/shadcn/button'
import { Save, RotateCcw } from 'lucide-react'
import {
  TitleWithSubtitle,
  BasicSettingsCard,
  PromptCard,
  ScheduledExecutionsCard,
  ToolAssignmentCard,
  SecurityAccessCard,
  FormActions,
} from './index'

// Example data
const defaultSchedules = [
  {
    id: '1',
    title: 'Daily Schedule',
    description: 'Generate daily cost analysis report for all active projects',
    nextExecution: '2024-01-15 09:00',
    frequency: 'Daily',
    status: 'active' as const,
  },
  {
    id: '2',
    title: 'Weekly Schedule',
    description: 'Check supplier inventory levels and alert if low',
    nextExecution: '2024-01-16 14:00',
    frequency: 'Weekly',
    status: 'inactive' as const,
  },
]

const defaultTools = [
  {
    id: '1',
    name: 'Database Query',
    description: 'Execute SQL queries on connected databases.',
    type: 'database',
    enabled: true,
  },
  {
    id: '2',
    name: 'Document Analyzer',
    description: 'Extract info from PDF and DOCX files.',
    type: 'document',
    enabled: true,
  },
]

const securityOptions = [
  {
    value: 'admins-only',
    label: 'Admins Only',
    description: 'Only administrators can manage this agent',
  },
  {
    value: 'managers',
    label: 'Managers',
    description: 'Managers and administrators can manage this agent',
  },
  {
    value: 'team',
    label: 'Team Members',
    description: 'All team members can manage this agent',
  },
]

export interface AgentConfigurationPageProps {
  agentId?: string
  className?: string
}

export function AgentConfigurationPage({
  agentId,
  className,
}: AgentConfigurationPageProps) {
  // State management
  const [agentName, setAgentName] = useState('Procurement Manager')
  const [roleType, setRoleType] = useState('Manager')
  const [prompt, setPrompt] = useState(
    'You are an expert AI assistant for construction procurement. Your primary goal is to analyze material costs, manage supplier relationships, and ensure legal compliance in all contracts. You must be precise, data-driven, and proactive in identifying cost-saving opportunities.'
  )
  const [schedules, setSchedules] = useState(defaultSchedules)
  const [tools, setTools] = useState(defaultTools)
  const [securityLevel, setSecurityLevel] = useState('admins-only')
  const [status, setStatus] = useState<'active' | 'inactive' | 'paused'>(
    'active'
  )
  const [isLoading, setIsLoading] = useState(false)

  // Event handlers
  const handleAddSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      title: 'New Schedule',
      description: 'Schedule description',
      nextExecution: '2024-01-20 10:00',
      frequency: 'Daily',
      status: 'active' as const,
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleEditSchedule = (id: string) => {
    console.log('Edit schedule:', id)
    // Implement edit modal or navigation
  }

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  const handleToggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              status: schedule.status === 'active' ? 'inactive' : 'active',
            }
          : schedule
      )
    )
  }

  const handleAddTool = () => {
    const newTool = {
      id: Date.now().toString(),
      name: 'New Tool',
      description: 'Tool description',
      type: 'api',
      enabled: false,
    }
    setTools([...tools, newTool])
  }

  const handleToggleTool = (id: string, enabled: boolean) => {
    setTools(
      tools.map((tool) => (tool.id === id ? { ...tool, enabled } : tool))
    )
  }

  const handleRemoveTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Saving configuration:', {
        agentName,
        roleType,
        prompt,
        schedules,
        tools,
        securityLevel,
        status,
      })
      // Show success message
    } catch (error) {
      console.error('Error saving configuration:', error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAgentName('Procurement Manager')
    setRoleType('Manager')
    setPrompt(
      'You are an expert AI assistant for construction procurement. Your primary goal is to analyze material costs, manage supplier relationships, and ensure legal compliance in all contracts. You must be precise, data-driven, and proactive in identifying cost-saving opportunities.'
    )
    setSchedules(defaultSchedules)
    setTools(defaultTools)
    setSecurityLevel('admins-only')
    setStatus('active')
  }

  return (
    <div className={cn('max-w-7xl mx-auto p-6 space-y-6', className)}>
      {/* Header */}
      <TitleWithSubtitle
        title={agentName}
        subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
        status={status}
        onStatusChange={setStatus}
      />

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <BasicSettingsCard
          agentName={agentName}
          onAgentNameChange={setAgentName}
          roleType={roleType}
          onRoleTypeChange={setRoleType}
        />

        {/* Scheduled Executions */}
        <ScheduledExecutionsCard
          schedules={schedules}
          onAddSchedule={handleAddSchedule}
          onEditSchedule={handleEditSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onToggleSchedule={handleToggleSchedule}
        />

        {/* Prompt */}
        <div className="lg:col-span-2">
          <PromptCard
            value={prompt}
            onChange={setPrompt}
            maxLength={4000}
            placeholder="Enter your prompt here..."
          />
        </div>

        {/* Tool Assignment */}
        <ToolAssignmentCard
          tools={tools}
          onAddTool={handleAddTool}
          onToggleTool={handleToggleTool}
          onRemoveTool={handleRemoveTool}
        />

        {/* Security & Access */}
        <SecurityAccessCard
          value={securityLevel}
          onChange={setSecurityLevel}
          options={securityOptions}
        />
      </div>

      {/* Form Actions */}
      <FormActions
        onSave={handleSave}
        onReset={handleReset}
        saveLabel="Save All Changes"
        resetLabel="Reset"
        loading={isLoading}
        className="mt-8"
      />
    </div>
  )
}
