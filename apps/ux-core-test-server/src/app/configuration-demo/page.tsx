'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  TitleWithSubtitle,
  FormCard,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTextarea,
  ActiveIndicator,
  SaveButton,
  ResetButton,
  AddButton,
  GhostButton,
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
  ChevronDown,
} from 'lucide-react'
import { elegantColors } from '@teamhub/ux-core'

export default function ConfigurationDemoPage() {
  const [agentName, setAgentName] = useState('Procurement Manager')
  const [roleType, setRoleType] = useState('Manager')
  const [showTemplates, setShowTemplates] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Prompt templates
  const promptTemplates = [
    {
      id: 'general',
      name: 'General Assistant',
      content: 'You are a helpful general-purpose AI assistant.',
    },
    {
      id: 'code',
      name: 'Code Helper',
      content: 'You are an expert programmer. Provide only code solutions.',
    },
    {
      id: 'creative',
      name: 'Creative Writer',
      content:
        'You are a creative writer. Generate imaginative and engaging content.',
    },
  ]

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTemplates(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTemplateSelect = (content: string) => {
    setPrompt(content)
    setShowTemplates(false)
  }
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
              headerContent={
                <div className="flex space-x-2">
                  <GhostButton icon={Sparkles}>AI</GhostButton>
                  <div className="relative" ref={dropdownRef}>
                    <GhostButton
                      onClick={() => setShowTemplates(!showTemplates)}
                      icon={FileText}
                    >
                      Templates
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          showTemplates ? 'rotate-180' : ''
                        }`}
                      />
                    </GhostButton>
                    {showTemplates && (
                      <div
                        className="absolute top-full right-0 mt-2 w-56 rounded-xl border overflow-hidden z-10"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: 'rgba(195, 192, 198, 0.8)',
                          boxShadow:
                            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        {promptTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() =>
                              handleTemplateSelect(template.content)
                            }
                            className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                            style={{
                              color: '#2D1B2E',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                'rgba(244, 243, 245, 0.8)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                'transparent')
                            }
                          >
                            {template.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
              headerAction={
                <AddButton onClick={handleAddSchedule}>Add Schedule</AddButton>
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
              headerAction={
                <AddButton onClick={handleAddTool}>Add Tool</AddButton>
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
        <div className="flex justify-end space-x-3">
          <ResetButton onClick={() => console.log('Resetting...')} />
          <SaveButton onClick={() => console.log('Saving...')} />
        </div>
      </div>
    </div>
  )
}
