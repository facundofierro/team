'use client'

import React, { useState } from 'react'
import {
  TitleWithSubtitle,
  FormCard,
  FormActions,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTextarea,
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
import { elegantColors } from '@teamhub/ux-core'

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
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: '#F4F3F5' }}
    >
      {/* Header - Full width, not a card */}
      <div
        className="px-6 py-4 border-b flex-shrink-0"
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
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Settings */}
            <FormCard title="Basic Settings">
              <EnhancedInput
                label="Agent Name"
                subtitle="The display name for your AI agent"
                value={agentName}
                onChange={setAgentName}
                placeholder="Enter agent name"
              />
              <EnhancedInput
                label="Role/Type"
                subtitle="The role or type of agent (e.g., Manager, Assistant, Specialist)"
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
                  <button
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      color: '#847F8A',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(244, 243, 245, 0.8)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: '#8A548C' }}
                    />
                    <span>AI</span>
                  </button>
                  <button
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      color: '#847F8A',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(244, 243, 245, 0.8)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <span>Templates</span>
                  </button>
                </div>
              }
            >
              <EnhancedTextarea
                value={prompt}
                onChange={setPrompt}
                placeholder="Enter your prompt here..."
                maxLength={4000}
                autoResize={true}
                minHeight={128}
                maxHeight={256}
              />
            </FormCard>

            {/* Security & Access */}
            <FormCard title="Security & Access" icon={Shield}>
              <div className="space-y-4">
                <EnhancedSelect
                  label="User Role Permissions"
                  subtitle="Define which user roles can manage this agent"
                  options={[
                    { value: 'admins', label: 'Admins Only' },
                    { value: 'all', label: 'All Users' },
                    { value: 'specific', label: 'Specific Roles' },
                  ]}
                  value="admins"
                  onChange={() => {}}
                />
                <EnhancedSelect
                  label="Chat Access Control"
                  subtitle="Specify who can initiate conversations with this agent"
                  options={[
                    {
                      value: 'specific-groups',
                      label: 'Users in Specific Groups',
                    },
                    { value: 'all', label: 'All Users' },
                    { value: 'none', label: 'No Access' },
                  ]}
                  value="specific-groups"
                  onChange={() => {}}
                />
                <EnhancedSelect
                  label="Configuration Access"
                  subtitle="Control who can view or edit this agent's configuration"
                  options={[
                    { value: '', label: 'Select access level...' },
                    { value: 'full', label: 'Full Access' },
                    { value: 'read-only', label: 'Read Only' },
                    { value: 'none', label: 'No Access' },
                  ]}
                  value=""
                  onChange={() => {}}
                />
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
                  className="px-3 py-1 text-sm rounded-md font-medium"
                  style={{
                    backgroundColor: '#8A548C',
                    color: '#FFFFFF',
                  }}
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
                  className="px-3 py-1 text-sm rounded-md font-medium"
                  style={{
                    backgroundColor: '#8A548C',
                    color: '#FFFFFF',
                  }}
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
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div
        className="px-6 py-4 border-t flex-shrink-0"
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
