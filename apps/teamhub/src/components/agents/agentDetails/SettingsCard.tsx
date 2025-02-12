'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Agent } from '@teamhub/db'
import type {
  AgentToolPermission,
  AgentPolicyRule,
  AgentMemoryRule,
} from '@teamhub/db'

type SettingsCardProps = {
  agent?: Agent
  onChange?: (agent: Partial<Agent>) => Promise<void>
}

export function SettingsCard({ agent, onChange }: SettingsCardProps) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    isActive: true,
    doesClone: false,
    systemPrompt: '',
    role: '',
    maxInstances: 1,
    toolPermissions: {},
    policyDefinitions: {},
    memoryRules: {},
  })

  const [tools, setTools] = useState<AgentToolPermission[]>([])
  const [policies, setPolicies] = useState<AgentPolicyRule[]>([])
  const [memoryRules, setMemoryRules] = useState<AgentMemoryRule[]>([])

  // Initialize data when agent changes
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        isActive: agent.isActive,
        doesClone: agent.doesClone,
        systemPrompt: agent.systemPrompt,
        role: agent.role,
        maxInstances: agent.maxInstances,
        toolPermissions: agent.toolPermissions,
        policyDefinitions: agent.policyDefinitions,
        memoryRules: agent.memoryRules,
      })

      // Initialize tools, policies, and memory rules from agent data
      setTools(
        Object.entries(agent.toolPermissions || {}).map(([toolId, name]) => ({
          toolId,
          name: String(name),
          permissions: [],
        }))
      )

      setPolicies(
        Object.entries(agent.policyDefinitions || {}).map(([id, rules]) => ({
          id,
          name: id,
          rules: Array.isArray(rules) ? rules : [],
          type: 'default',
          targetAgentId: '',
          messageType: 'text',
        }))
      )

      setMemoryRules(
        Object.entries(agent.memoryRules || {}).map(([id, condition]) => ({
          messageType: 'text',
          shouldStore: true,
          retentionDays: 0,
        }))
      )
    }
  }, [agent])

  const handleChange = (field: keyof Agent, value: any) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    onChange?.({ id: agent?.id, ...updatedData })
  }

  const handleAddTool = () => {
    const newTool: AgentToolPermission = {
      toolId: crypto.randomUUID(),
      maxUsagePerDay: 0,
      role: '',
    }
    setTools([...tools, newTool])
  }

  const handleAddPolicy = () => {
    const newPolicy: AgentPolicyRule = {
      targetAgentId: '',
      messageType: 'text',
      maxMessagesPerDay: 0,
      maxStepsPerTask: 0,
    }
    setPolicies([...policies, newPolicy])
  }

  const handleAddMemoryRule = () => {
    const newRule: AgentMemoryRule = {
      messageType: 'text',
      shouldStore: true,
      retentionDays: 0,
    }
    setMemoryRules([...memoryRules, newRule])
  }

  return (
    <div className="h-full p-6 space-y-6">
      {/* Basic Settings */}
      <div className="grid gap-4">
        <div className="space-y-4">
          <div className="flex flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange('isActive', checked)
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="clone"
                  checked={formData.doesClone}
                  onCheckedChange={(checked) =>
                    handleChange('doesClone', checked)
                  }
                />
                <Label htmlFor="clone">Multiple Instances</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              className="h-40"
              id="systemPrompt"
              value={formData.systemPrompt || ''}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tools, Policies, and Memory Rules */}
      <div className="grid flex-1 grid-cols-3 gap-4">
        {/* Tools Column */}
        <div className="flex flex-col min-h-0">
          <h3 className="mb-4 text-lg font-medium text-center shrink-0">
            Tools
          </h3>
          <ScrollArea className="flex-1 min-h-0 border rounded-md">
            <div className="p-4 space-y-4">
              {tools.map((tool) => (
                <Card key={tool.toolId} className="p-4">
                  <p className="font-medium">{tool.toolId}</p>
                </Card>
              ))}
              <Card
                className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary"
                onClick={handleAddTool}
              >
                <div className="space-y-2 text-center">
                  <Plus className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Add new tool</p>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Policies Column */}
        <div className="flex flex-col min-h-0">
          <h3 className="mb-4 text-lg font-medium text-center shrink-0">
            Policies
          </h3>
          <ScrollArea className="flex-1 min-h-0 border rounded-md">
            <div className="p-4 space-y-4">
              {policies.map((policy) => (
                <Card
                  key={policy.targetAgentId + policy.messageType}
                  className="p-4"
                >
                  <p className="font-medium">{policy.targetAgentId}</p>
                  <p className="text-sm text-muted-foreground">
                    {policy.messageType}
                  </p>
                </Card>
              ))}
              <Card
                className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary"
                onClick={handleAddPolicy}
              >
                <div className="space-y-2 text-center">
                  <Plus className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Add new policy
                  </p>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Memory Rules Column */}
        <div className="flex flex-col min-h-0">
          <h3 className="mb-4 text-lg font-medium text-center shrink-0">
            Memory Rules
          </h3>
          <ScrollArea className="flex-1 min-h-0 border rounded-md">
            <div className="p-4 space-y-4">
              {memoryRules.map((rule) => (
                <Card key={rule.category} className="p-4">
                  <p className="font-medium">{rule.messageType}</p>
                  <p className="text-sm text-muted-foreground">
                    {rule.shouldStore}
                  </p>
                </Card>
              ))}
              <Card
                className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary"
                onClick={handleAddMemoryRule}
              >
                <div className="space-y-2 text-center">
                  <Plus className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Add new memory rule
                  </p>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
