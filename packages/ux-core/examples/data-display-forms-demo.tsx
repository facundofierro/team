'use client'

import React from 'react'
import {
  StatusIndicator,
  AgentCard,
  MetricCard,
  DataTable,
  ListItem,
  EmptyState,
  FormSection,
  EnhancedInput,
  EnhancedSelect,
  Toggle,
  ScheduleItem,
  ToolItem,
  FormActions,
} from '../src/components-core'
import { Button } from '../src/components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../src/components/shadcn/card'
import {
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Database,
  FileText,
  Globe,
  Wrench,
  Plus,
  Search,
  Filter,
  List,
  ArrowUpDown,
} from 'lucide-react'

export default function DataDisplayFormsDemo() {
  const [selectedAgent, setSelectedAgent] = React.useState('1')
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = React.useState<keyof AgentData>('name')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  )

  // Sample data for agents
  const agents = [
    {
      id: '1',
      title: 'Procurement Manager',
      description: 'Materials sourcing and supplier management',
      status: 'active' as const,
      type: 'Manager',
      lastActive: '2 hours ago',
      metrics: {
        cost: '$284.50',
        responseTime: '1.2s',
        successRate: '98.2%',
      },
    },
    {
      id: '2',
      title: 'Material Sourcer',
      description: 'Finds and evaluates construction materials',
      status: 'active' as const,
      type: 'Sourcer',
      lastActive: '1 hour ago',
      metrics: {
        cost: '$156.80',
        responseTime: '0.8s',
        successRate: '99.1%',
      },
    },
    {
      id: '3',
      title: 'Vendor Negotiator',
      description: 'Negotiates contracts with suppliers',
      status: 'warning' as const,
      type: 'Negotiator',
      lastActive: '3 hours ago',
      metrics: {
        cost: '$89.20',
        responseTime: '2.1s',
        successRate: '94.5%',
      },
    },
  ]

  // Sample data for metrics
  const metrics = [
    {
      title: 'Total Cost',
      value: '$1,284.50',
      trend: { value: 5.2, isPositive: false, period: 'last 30 days' },
      icon: DollarSign,
      variant: 'default' as const,
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      trend: { value: 15.8, isPositive: false, period: 'last 30 days' },
      icon: Clock,
      variant: 'success' as const,
    },
    {
      title: 'Success Rate',
      value: '98.2%',
      trend: { value: 1.5, isPositive: true, period: 'last 30 days' },
      icon: CheckCircle,
      variant: 'success' as const,
    },
    {
      title: 'User Satisfaction',
      value: '9.2/10',
      trend: { value: 3.1, isPositive: true, period: 'avg. rating' },
      icon: TrendingUp,
      variant: 'success' as const,
    },
  ]

  // Sample data for table
  interface AgentData {
    id: string
    name: string
    type: string
    status: string
    lastActive: string
    cost: string
  }

  const tableData: AgentData[] = [
    {
      id: '1',
      name: 'Procurement Manager',
      type: 'Manager',
      status: 'Active',
      lastActive: '2 hours ago',
      cost: '$284.50',
    },
    {
      id: '2',
      name: 'Material Sourcer',
      type: 'Sourcer',
      status: 'Active',
      lastActive: '1 hour ago',
      cost: '$156.80',
    },
    {
      id: '3',
      name: 'Vendor Negotiator',
      type: 'Negotiator',
      status: 'Warning',
      lastActive: '3 hours ago',
      cost: '$89.20',
    },
    {
      id: '4',
      name: 'Price Analyzer',
      type: 'Analyzer',
      status: 'Active',
      lastActive: '4 hours ago',
      cost: '$67.30',
    },
    {
      id: '5',
      name: 'Business Development',
      type: 'Sales',
      status: 'Warning',
      lastActive: '5 hours ago',
      cost: '$45.90',
    },
  ]

  const tableColumns = [
    { key: 'name', header: 'Agent Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <StatusIndicator
          status={value.toLowerCase() as any}
          size="sm"
          showLabel={false}
        />
      ),
    },
    { key: 'lastActive', header: 'Last Active', sortable: true },
    { key: 'cost', header: 'Cost', sortable: true },
  ]

  // Sample data for schedules
  const schedules = [
    {
      id: '1',
      title: 'Daily Schedule',
      description:
        'Generate daily cost analysis report for all active projects',
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
      status: 'active' as const,
    },
  ]

  // Sample data for tools
  const tools = [
    {
      id: '1',
      name: 'Database Query',
      description: 'Execute SQL queries on connected databases',
      type: 'database',
      enabled: true,
    },
    {
      id: '2',
      name: 'Document Analyzer',
      description: 'Extract info from PDF and DOCX files',
      type: 'document',
      enabled: true,
    },
  ]

  // Form state
  const [formData, setFormData] = React.useState({
    agentName: 'Procurement Manager',
    roleType: 'Manager',
    prompt: 'You are an expert AI assistant for construction procurement...',
    userRolePermissions: 'admins-only',
    chatAccessControl: 'specific-groups',
    configurationAccess: 'admins-only',
  })

  const handleSort = (key: keyof AgentData) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDirection('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    return [...tableData].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [tableData, sortBy, sortDirection])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Display & Forms Demo
          </h1>
          <p className="text-lg text-gray-600">
            Phase 2: Complete set of data display and form components for
            TeamHub
          </p>
        </div>

        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <StatusIndicator status="active" size="sm" />
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIndicator status="warning" size="sm" />
                <span className="text-sm text-gray-600">Warning</span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIndicator status="error" size="sm" />
                <span className="text-sm text-gray-600">Error</span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIndicator status="pending" size="sm" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  trend={metric.trend}
                  icon={metric.icon}
                  variant={metric.variant}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  {...agent}
                  selected={selectedAgent === agent.id}
                  actions={{
                    onEdit: () => console.log('Edit', agent.id),
                    onSettings: () => console.log('Settings', agent.id),
                    onToggle: () => console.log('Toggle', agent.id),
                  }}
                  onClick={() => setSelectedAgent(agent.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={tableColumns}
              data={sortedData}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              onRowClick={(item) => console.log('Row clicked:', item)}
            />
          </CardContent>
        </Card>

        {/* List Items */}
        <Card>
          <CardHeader>
            <CardTitle>List Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {agents.slice(0, 3).map((agent) => (
                <ListItem
                  key={agent.id}
                  id={agent.id}
                  title={agent.title}
                  description={agent.description}
                  subtitle={agent.lastActive}
                  status={agent.status}
                  selected={selectedAgent === agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  actions={
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forms Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Form Components</h2>

          {/* Basic Settings Form */}
          <FormSection
            title="Basic Settings"
            subtitle="Configure the basic properties of your AI agent"
            icon={Users}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedInput
                label="Agent Name"
                value={formData.agentName}
                onChange={(value) =>
                  setFormData({ ...formData, agentName: value })
                }
                placeholder="Enter agent name"
                required
              />
              <EnhancedInput
                label="Role/Type"
                value={formData.roleType}
                onChange={(value) =>
                  setFormData({ ...formData, roleType: value })
                }
                placeholder="Enter role type"
                required
              />
            </div>
          </FormSection>

          {/* Prompt Form */}
          <FormSection
            title="Prompt"
            subtitle="Define the AI agent's behavior and capabilities"
            icon={FileText}
          >
            <EnhancedInput
              label="AI Prompt"
              value={formData.prompt}
              onChange={(value) => setFormData({ ...formData, prompt: value })}
              placeholder="Enter the AI prompt..."
              maxLength={4000}
              showCount
              required
            />
          </FormSection>

          {/* Scheduled Executions */}
          <FormSection
            title="Scheduled Executions"
            subtitle="Set up automated tasks and workflows"
            icon={Clock}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Execution Schedules
                </h4>
                <Button className="bg-[#8A548C] hover:bg-[#7A448C] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
              {schedules.map((schedule) => (
                <ScheduleItem
                  key={schedule.id}
                  {...schedule}
                  onEdit={() => console.log('Edit schedule:', schedule.id)}
                  onDelete={() => console.log('Delete schedule:', schedule.id)}
                  onToggle={() => console.log('Toggle schedule:', schedule.id)}
                />
              ))}
            </div>
          </FormSection>

          {/* Tool Assignment */}
          <FormSection
            title="Tool Assignment"
            subtitle="Assign tools and capabilities to your agent"
            icon={Wrench}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Assigned Tools</h4>
                <Button className="bg-[#8A548C] hover:bg-[#7A448C] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tool
                </Button>
              </div>
              {tools.map((tool) => (
                <ToolItem
                  key={tool.id}
                  {...tool}
                  onToggle={(enabled) =>
                    console.log('Toggle tool:', tool.id, enabled)
                  }
                  onRemove={() => console.log('Remove tool:', tool.id)}
                />
              ))}
            </div>
          </FormSection>

          {/* Security & Access */}
          <FormSection
            title="Security & Access"
            subtitle="Control who can access and manage this agent"
            icon={Shield}
          >
            <div className="space-y-4">
              <EnhancedSelect
                label="User Role Permissions"
                options={[
                  {
                    value: 'admins-only',
                    label: 'Admins Only',
                    description: 'Only administrators can manage this agent',
                  },
                  {
                    value: 'managers',
                    label: 'Managers & Admins',
                    description:
                      'Managers and administrators can manage this agent',
                  },
                  {
                    value: 'all-users',
                    label: 'All Users',
                    description:
                      'All authenticated users can manage this agent',
                  },
                ]}
                value={formData.userRolePermissions}
                onChange={(value) =>
                  setFormData({ ...formData, userRolePermissions: value })
                }
                icon={User}
              />

              <EnhancedSelect
                label="Chat Access Control"
                options={[
                  {
                    value: 'all-users',
                    label: 'All Users',
                    description: 'Anyone can chat with this agent',
                  },
                  {
                    value: 'specific-groups',
                    label: 'Users in Specific Groups',
                    description: 'Only members of selected groups can chat',
                  },
                  {
                    value: 'authenticated-only',
                    label: 'Authenticated Users Only',
                    description: 'Only logged-in users can chat',
                  },
                ]}
                value={formData.chatAccessControl}
                onChange={(value) =>
                  setFormData({ ...formData, chatAccessControl: value })
                }
                icon={Users}
              />

              <EnhancedSelect
                label="Configuration Access"
                options={[
                  {
                    value: 'admins-only',
                    label: 'Admins Only',
                    description:
                      'Only administrators can view or edit configuration',
                  },
                  {
                    value: 'managers',
                    label: 'Managers & Admins',
                    description: 'Managers and administrators can view or edit',
                  },
                  {
                    value: 'view-only',
                    label: 'View Only',
                    description: 'Users can view but not edit configuration',
                  },
                ]}
                value={formData.configurationAccess}
                onChange={(value) =>
                  setFormData({ ...formData, configurationAccess: value })
                }
                icon={Lock}
              />
            </div>
          </FormSection>

          {/* Toggle Examples */}
          <FormSection
            title="Toggle Controls"
            subtitle="Various toggle switch configurations"
            icon={Settings}
          >
            <div className="space-y-4">
              <Toggle
                label="Agent Status"
                description="Enable or disable this agent"
                checked={true}
                onChange={(checked) => console.log('Agent status:', checked)}
                size="md"
              />

              <Toggle
                label="Auto-scaling"
                description="Automatically scale resources based on demand"
                checked={false}
                onChange={(checked) => console.log('Auto-scaling:', checked)}
                size="lg"
              />

              <Toggle
                label="Debug Mode"
                description="Enable detailed logging and debugging"
                checked={false}
                onChange={(checked) => console.log('Debug mode:', checked)}
                size="sm"
              />
            </div>
          </FormSection>

          {/* Form Actions */}
          <FormSection
            title="Form Actions"
            subtitle="Standard form action buttons"
            icon={Settings}
          >
            <FormActions
              onSave={() => console.log('Saving...')}
              onCancel={() => console.log('Canceling...')}
              onReset={() => console.log('Resetting...')}
              saveLabel="Save Configuration"
              cancelLabel="Cancel Changes"
              resetLabel="Reset to Defaults"
            />
          </FormSection>
        </div>

        {/* Empty State Example */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No agents found"
              description="Get started by creating your first AI agent to automate your workflows and improve productivity."
              icon={Users}
              action={{
                label: 'Create Agent',
                onClick: () => console.log('Create agent clicked'),
                variant: 'default',
              }}
            />
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Agent Card Usage</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { AgentCard } from '@agelum/ux-core'

<AgentCard
  id="1"
  title="Procurement Manager"
  description="Materials sourcing and supplier management"
  status="active"
  type="Manager"
  metrics={{
    cost: '$284.50',
    responseTime: '1.2s',
    successRate: '98.2%'
  }}
  actions={{
    onEdit: () => handleEdit(),
    onSettings: () => handleSettings(),
    onToggle: () => handleToggle()
  }}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Metrics Card Usage</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { MetricCard } from '@agelum/ux-core'

<MetricCard
  title="Total Cost"
  value="$1,284.50"
  trend={{ value: 5.2, isPositive: false, period: 'last 30 days' }}
  icon={DollarSign}
  variant="default"
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Form Section Usage</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { FormSection, EnhancedInput } from '@agelum/ux-core'

<FormSection
  title="Basic Settings"
  subtitle="Configure the basic properties"
  icon={Users}
>
  <EnhancedInput
    label="Agent Name"
    value={agentName}
    onChange={setAgentName}
    placeholder="Enter agent name"
    required
  />
</FormSection>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
