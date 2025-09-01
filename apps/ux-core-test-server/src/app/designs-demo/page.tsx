'use client'

import React, { useState } from 'react'
import {
  TitleWithSubtitle,
  FormCard,
  FormActions,
  EnhancedInput,
  ActiveIndicator,
} from '@teamhub/ux-core'
import {
  ConfigurationCard,
  ScheduledExecutionItem,
  ToolAssignmentItem,
} from '@/components/configuration'

// Sample data matching the screenshot
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

export default function DesignsDemoPage() {
  // State management matching the screenshot
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
    <div className="min-h-screen" style={{ backgroundColor: '#F4F3F5' }}>
      {/* Main Container - matching the 800px max-width from the reference */}
      <div
        className="max-w-[800px] mx-auto min-h-screen flex flex-col"
        style={{ backgroundColor: '#F4F3F5' }}
      >
        {/* Header Section */}
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(215, 213, 217, 0.6)' }}
        >
          <TitleWithSubtitle
            title={agentName}
            subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
          />
          <ActiveIndicator isActive={status === 'active'} onToggle={() => {}} />
        </div>

        {/* Main Content - matching the reference layout */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Left Column - Basic Settings, Prompt, Security */}
            <div className="space-y-4">
              {/* Basic Settings */}
              <ConfigurationCard title="Basic Settings">
                <div className="space-y-4">
                  <EnhancedInput
                    label="Agent Name*"
                    value={agentName}
                    onChange={setAgentName}
                    placeholder="Enter agent name"
                  />
                  <EnhancedInput
                    label="Role/Type*"
                    value={roleType}
                    onChange={setRoleType}
                    placeholder="Enter role or type"
                  />
                </div>
              </ConfigurationCard>

              {/* Prompt Card */}
              <ConfigurationCard
                title="Prompt"
                headerContent={
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                      <span>AI</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                      <span>Templates</span>
                    </button>
                  </div>
                }
              >
                <div className="space-y-3">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Define the agent's primary instructions, role, and constraints..."
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    style={{
                      backgroundColor: '#F4F3F5',
                      borderColor: 'rgba(195, 192, 198, 0.8)',
                      color: '#2D1B2E',
                    }}
                  />
                  <div className="text-right">
                    <span className="text-xs" style={{ color: '#847F8A' }}>
                      {prompt.length} / 4000
                    </span>
                  </div>
                </div>
              </ConfigurationCard>

              {/* Security & Access */}
              <ConfigurationCard title="Security & Access">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="text-sm font-medium">
                        User Role Permissions
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Define which user roles can manage this agent.
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center justify-between w-full p-3 border border-border rounded-md hover:bg-accent">
                    <span className="text-sm">Admins Only</span>
                  </button>
                </div>
              </ConfigurationCard>
            </div>

            {/* Right Column - Scheduled Executions and Tool Assignment */}
            <div className="space-y-4">
              {/* Scheduled Executions */}
              <ConfigurationCard
                title="Scheduled Executions"
                headerAction={
                  <button
                    onClick={handleAddSchedule}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    <span>Add Schedule</span>
                  </button>
                }
              >
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <ScheduledExecutionItem
                      key={schedule.id}
                      id={schedule.id}
                      name={schedule.title}
                      description={schedule.description}
                      schedule={schedule.frequency}
                      nextExecution={schedule.nextExecution}
                      status={schedule.status}
                      onToggle={(id, status) => handleToggleSchedule(id)}
                      onEdit={handleEditSchedule}
                      onDelete={handleDeleteSchedule}
                    />
                  ))}
                </div>
              </ConfigurationCard>

              {/* Tool Assignment */}
              <ConfigurationCard
                title="Tool Assignment"
                headerAction={
                  <button
                    onClick={handleAddTool}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    <span>Add Tool</span>
                  </button>
                }
              >
                <div className="space-y-3">
                  {tools.map((tool) => (
                    <ToolAssignmentItem
                      key={tool.id}
                      id={tool.id}
                      name={tool.name}
                      description={tool.description}
                      enabled={tool.enabled}
                      onToggle={handleToggleTool}
                      onRemove={handleRemoveTool}
                    />
                  ))}
                </div>
              </ConfigurationCard>
            </div>
          </div>
        </main>

        {/* Footer with Actions - matching the reference */}
        <footer
          className="px-4 py-3 border-t"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(215, 213, 217, 0.6)',
          }}
        >
          <FormActions
            onSave={handleSave}
            onReset={handleReset}
            saveLabel="Save All Changes"
            resetLabel="Reset"
            loading={isLoading}
          />
        </footer>
      </div>
    </div>
  )
}
