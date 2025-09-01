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
  ScheduledExecutionItem,
  ToolAssignmentItem,
} from '@/components/configuration'
import {
  Sparkles,
  FileText,
  Shield,
  Plus,
  Database,
  Calendar,
} from 'lucide-react'

export default function ConfigurationDemoPage() {
  const [agentName, setAgentName] = useState('Procurement Manager')
  const [roleType, setRoleType] = useState('Manager')
  const [prompt, setPrompt] = useState(
    'You are an expert AI assistant for construction procurement. Your primary goal is to analyze material costs, manage supplier relationships, and ensure legal compliance in all contracts. You must be precise, data-driven, and proactive in identifying cost-saving opportunities.'
  )
  const [isActive, setIsActive] = useState(true)
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      name: 'Daily',
      description:
        'Generate daily cost analysis report for all active projects',
      schedule: 'Daily at 9:00 AM',
      nextExecution: '2024-01-15 09:00',
      isActive: true,
    },
    {
      id: '2',
      name: 'Weekly',
      description: 'Check supplier inventory levels and alert if low',
      schedule: 'Weekly on Monday at 2:00 PM',
      nextExecution: '2024-01-16 14:00',
      isActive: false,
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

  const handleToggleSchedule = (id: string, isActive: boolean) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, isActive } : s)))
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
      isActive: true,
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
      {/* Header - Full width, not a card */}
      <div
        className="px-6 py-4 border-b"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(215, 213, 217, 0.6)',
        }}
      >
        <div className="flex items-center justify-between">
          <TitleWithSubtitle
            title="Procurement Manager"
            subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
          />
          <ActiveIndicator isActive={isActive} onToggle={setIsActive} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Settings */}
            <FormCard title="Basic Settings" icon={Shield}>
              <EnhancedInput
                label="Agent Name"
                value={agentName}
                onChange={setAgentName}
                placeholder="Enter agent name"
              />
              <EnhancedInput
                label="Role/Type"
                value={roleType}
                onChange={setRoleType}
                placeholder="Enter role or type"
              />
            </FormCard>

            {/* Prompt */}
            <FormCard
              title="Prompt"
              icon={Sparkles}
              headerContent={
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                    AI
                  </button>
                  <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                    Templates
                  </button>
                </div>
              }
            >
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  style={{
                    backgroundColor: '#F4F3F5',
                    borderColor: 'rgba(195, 192, 198, 0.8)',
                    color: '#2D1B2E',
                  }}
                  placeholder="Enter your prompt here..."
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {prompt.length} / 4000
                </div>
              </div>
            </FormCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Scheduled Executions */}
            <FormCard
              title="Scheduled Executions"
              icon={Calendar}
              headerAction={
                <button
                  onClick={handleAddSchedule}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  + Add Schedule
                </button>
              }
            >
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <ScheduledExecutionItem
                    key={schedule.id}
                    id={schedule.id}
                    name={schedule.name}
                    description={schedule.description}
                    schedule={schedule.schedule}
                    nextExecution={schedule.nextExecution}
                    status={schedule.isActive ? 'active' : 'inactive'}
                    onToggle={(id, status) =>
                      handleToggleSchedule(id, status === 'active')
                    }
                    onEdit={() => {}}
                    onDelete={(id) =>
                      setSchedules(schedules.filter((s) => s.id !== id))
                    }
                  />
                ))}
              </div>
            </FormCard>

            {/* Tool Assignment */}
            <FormCard
              title="Tool Assignment"
              icon={Database}
              headerAction={
                <button
                  onClick={handleAddTool}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  + Add Tool
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
                    onToggle={(id, enabled) => handleToggleTool(id, enabled)}
                    onRemove={(id) =>
                      setTools(tools.filter((t) => t.id !== id))
                    }
                  />
                ))}
              </div>
            </FormCard>

            {/* Security & Access */}
            <FormCard title="Security & Access" icon={Shield}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    User Role Permissions
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    style={{
                      backgroundColor: '#F4F3F5',
                      borderColor: 'rgba(195, 192, 198, 0.8)',
                      color: '#2D1B2E',
                    }}
                  >
                    <option>Admins Only</option>
                    <option>All Users</option>
                    <option>Specific Roles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chat Access Control
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    style={{
                      backgroundColor: '#F4F3F5',
                      borderColor: 'rgba(195, 192, 198, 0.8)',
                      color: '#2D1B2E',
                    }}
                  >
                    <option>Users in Specific Groups</option>
                    <option>All Users</option>
                    <option>No Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Configuration Access
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    style={{
                      backgroundColor: '#F4F3F5',
                      borderColor: 'rgba(195, 192, 198, 0.8)',
                      color: '#2D1B2E',
                    }}
                  >
                    <option>Select access level...</option>
                    <option>Full Access</option>
                    <option>Read Only</option>
                    <option>No Access</option>
                  </select>
                </div>
              </div>
            </FormCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(215, 213, 217, 0.6)',
        }}
      >
        <FormActions
          onReset={() => console.log('Resetting...')}
          onSave={() => console.log('Saving...')}
          resetLabel="Reset"
          saveLabel="Save All Changes"
        />
      </div>
    </div>
  )
}
