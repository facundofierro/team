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
import {
  Sparkles,
  FileText,
  Shield,
  Plus,
  Database,
  FileText as FileTextIcon,
} from 'lucide-react'

export default function ConfigurationDemoPage() {
  const [agentName, setAgentName] = useState('Procurement Manager')
  const [roleType, setRoleType] = useState('Manager')
  const [prompt, setPrompt] = useState(
    'You are an expert AI assistant for construction procurement. Your primary goal is to analyze material costs, manage supplier relationships, and ensure legal compliance in all contracts. You must be precise, data-driven, and proactive in identifying cost-saving opportunities.'
  )
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      name: 'Daily',
      description:
        'Generate daily cost analysis report for all active projects',
      schedule: 'Daily at 9:00 AM',
      nextExecution: '2024-01-15 09:00',
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Weekly',
      description: 'Check supplier inventory levels and alert if low',
      schedule: 'Weekly on Monday at 2:00 PM',
      nextExecution: '2024-01-16 14:00',
      status: 'inactive' as const,
    },
  ])
  const [tools, setTools] = useState([
    {
      id: '1',
      name: 'Database Query',
      description: 'Execute SQL queries on connected databases.',
      enabled: true,
    },
    {
      id: '2',
      name: 'Document Analyzer',
      description: 'Extract info from PDF and DOCX files.',
      enabled: false,
    },
  ])

  const handleToggleSchedule = (
    id: string,
    newStatus: 'active' | 'inactive'
  ) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    )
  }

  const handleToggleTool = (id: string, enabled: boolean) => {
    setTools(tools.map((t) => (t.id === id ? { ...t, enabled } : t)))
  }

  const handleAddSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      name: 'New Schedule',
      description: 'Add description here',
      schedule: 'Daily at 12:00 PM',
      nextExecution: '2024-01-20 12:00',
      status: 'active' as const,
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleAddTool = () => {
    const newTool = {
      id: Date.now().toString(),
      name: 'New Tool',
      description: 'Add tool description here',
      enabled: false,
    }
    setTools([...tools, newTool])
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F3F5' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 rounded-lg border"
          style={{
            backgroundColor: '#F4F3F5',
            borderColor: 'rgba(215, 213, 217, 0.6)',
          }}
        >
          <TitleWithSubtitle
            title={agentName}
            subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
            titleClassName="text-xl font-bold"
            subtitleClassName="text-xs mt-0.5"
          />
          <ActiveIndicator isActive={status === 'active'} />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <ConfigurationCard title="Basic Settings" icon={Shield}>
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

          {/* Scheduled Executions */}
          <ConfigurationCard
            title="Scheduled Executions"
            icon={Shield}
            headerAction={
              <button
                onClick={handleAddSchedule}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Add Schedule</span>
              </button>
            }
          >
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <ScheduledExecutionItem
                  key={schedule.id}
                  {...schedule}
                  onToggle={handleToggleSchedule}
                  onEdit={() => {}}
                  onDelete={(id) =>
                    setSchedules(schedules.filter((s) => s.id !== id))
                  }
                />
              ))}
            </div>
          </ConfigurationCard>

          {/* Prompt */}
          <div className="lg:col-span-2">
            <ConfigurationCard
              title="Prompt"
              headerContent={
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                    <Sparkles className="w-4 h-4" />
                    <span>AI</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                    <FileText className="w-4 h-4" />
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
          </div>

          {/* Tool Assignment */}
          <ConfigurationCard
            title="Tool Assignment"
            icon={Shield}
            headerAction={
              <button
                onClick={handleAddTool}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tool</span>
              </button>
            }
          >
            <div className="space-y-3">
              {tools.map((tool) => (
                <ToolAssignmentItem
                  key={tool.id}
                  {...tool}
                  onToggle={handleToggleTool}
                  onRemove={(id) => setTools(tools.filter((t) => t.id !== id))}
                />
              ))}
            </div>
          </ConfigurationCard>

          {/* Security & Access */}
          <ConfigurationCard title="Security & Access" icon={Shield}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">User Role Permissions</h4>
                  <p className="text-xs text-muted-foreground">
                    Define which user roles can manage this agent.
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-between w-full p-3 border border-border rounded-md hover:bg-accent">
                <span className="text-sm">Admins Only</span>
                <Database className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </ConfigurationCard>
        </div>

        {/* Form Actions */}
        <div
          className="flex items-center justify-between p-4 rounded-lg border"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(215, 213, 217, 0.6)',
          }}
        >
          <FormActions
            onSave={() => console.log('Saving...')}
            onReset={() => console.log('Resetting...')}
            saveLabel="Save All Changes"
            resetLabel="Reset"
          />
        </div>
      </div>
    </div>
  )
}
