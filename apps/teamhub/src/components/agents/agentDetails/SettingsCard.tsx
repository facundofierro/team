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
import { Plus, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Agent, ToolWithTypes } from '@teamhub/db'
import type {
  AgentToolPermission,
  AgentPolicyRule,
  AgentMemoryRule,
  AgentToolPermissions,
} from '@teamhub/db'

type SettingsCardProps = {
  agent?: Agent
  onChange?: (agent: Partial<Agent>) => Promise<void>
  availableTools?: ToolWithTypes[]
}

export function SettingsCard({
  agent,
  onChange,
  availableTools = [],
}: SettingsCardProps) {
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

  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(new Set())
  const [toolPermissions, setToolPermissions] = useState<
    Record<string, AgentToolPermission>
  >({})
  const [policies, setPolicies] = useState<AgentPolicyRule[]>([])
  const [memoryRules, setMemoryRules] = useState<AgentMemoryRule[]>([])
  const [isAddingTool, setIsAddingTool] = useState(false)

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

      // Parse tool permissions properly
      const agentToolPermissions = agent.toolPermissions as AgentToolPermissions
      if (agentToolPermissions?.rules) {
        const toolIds = new Set(
          agentToolPermissions.rules.map((rule) => rule.toolId)
        )
        setSelectedToolIds(toolIds)

        const permissionsMap: Record<string, AgentToolPermission> = {}
        agentToolPermissions.rules.forEach((rule) => {
          permissionsMap[rule.toolId] = rule
        })
        setToolPermissions(permissionsMap)
      } else {
        setSelectedToolIds(new Set())
        setToolPermissions({})
      }

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

  const handleAddTool = (toolId: string) => {
    const newSelectedToolIds = new Set(selectedToolIds)
    const newToolPermissions = { ...toolPermissions }

    // Add tool with default permissions
    newSelectedToolIds.add(toolId)
    newToolPermissions[toolId] = {
      toolId,
      maxUsagePerDay: 0, // 0 means unlimited
      role: undefined,
    }

    setSelectedToolIds(newSelectedToolIds)
    setToolPermissions(newToolPermissions)

    // Update the agent with new tool permissions
    const agentToolPermissions: AgentToolPermissions = {
      rules: Array.from(newSelectedToolIds).map((id) => newToolPermissions[id]),
    }

    handleChange('toolPermissions', agentToolPermissions)
    setIsAddingTool(false)
  }

  const handleRemoveTool = (toolId: string) => {
    const newSelectedToolIds = new Set(selectedToolIds)
    const newToolPermissions = { ...toolPermissions }

    // Remove tool
    newSelectedToolIds.delete(toolId)
    delete newToolPermissions[toolId]

    setSelectedToolIds(newSelectedToolIds)
    setToolPermissions(newToolPermissions)

    // Update the agent with new tool permissions
    const agentToolPermissions: AgentToolPermissions = {
      rules: Array.from(newSelectedToolIds).map((id) => newToolPermissions[id]),
    }

    handleChange('toolPermissions', agentToolPermissions)
  }

  const handleUpdateToolPermission = (
    toolId: string,
    field: keyof AgentToolPermission,
    value: any
  ) => {
    const newToolPermissions = {
      ...toolPermissions,
      [toolId]: {
        ...toolPermissions[toolId],
        [field]: value,
      },
    }
    setToolPermissions(newToolPermissions)

    // Update the agent with new tool permissions
    const agentToolPermissions: AgentToolPermissions = {
      rules: Array.from(selectedToolIds).map((id) => newToolPermissions[id]),
    }

    handleChange('toolPermissions', agentToolPermissions)
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
    <Card className="h-full overflow-hidden bg-[#f8f9fa]">
      <div className="p-6 space-y-6">
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
            <ScrollArea className="flex-1 min-h-0 border rounded-md bg-background/50">
              <div className="p-4 space-y-4">
                {/* Show assigned tools */}
                {Array.from(selectedToolIds).map((toolId) => {
                  const tool = availableTools.find((t) => t.id === toolId)
                  const permission = toolPermissions[toolId]

                  if (!tool) return null

                  return (
                    <Card key={tool.id} className="p-4 bg-background/80">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tool.type}
                            </p>
                            {tool.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {tool.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveTool(tool.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {permission && (
                          <div className="pt-2 border-t space-y-2">
                            <div className="space-y-1">
                              <Label className="text-xs">
                                Max Usage Per Day (0 = unlimited)
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={permission.maxUsagePerDay || 0}
                                onChange={(e) =>
                                  handleUpdateToolPermission(
                                    tool.id,
                                    'maxUsagePerDay',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                            {permission.role !== undefined && (
                              <div className="space-y-1">
                                <Label className="text-xs">Role</Label>
                                <Input
                                  value={permission.role || ''}
                                  onChange={(e) =>
                                    handleUpdateToolPermission(
                                      tool.id,
                                      'role',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional role"
                                  className="h-8"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}

                {/* Add Tool Button */}
                <Card
                  className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary bg-background/80"
                  onClick={() => setIsAddingTool(true)}
                >
                  <div className="space-y-2 text-center">
                    <Plus className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add tool</p>
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
            <ScrollArea className="flex-1 min-h-0 border rounded-md bg-background/50">
              <div className="p-4 space-y-4">
                {policies.map((policy) => (
                  <Card
                    key={policy.targetAgentId + policy.messageType}
                    className="p-4 bg-background/80"
                  >
                    <p className="font-medium">{policy.targetAgentId}</p>
                    <p className="text-sm text-muted-foreground">
                      {policy.messageType}
                    </p>
                  </Card>
                ))}
                <Card
                  className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary bg-background/80"
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
            <ScrollArea className="flex-1 min-h-0 border rounded-md bg-background/50">
              <div className="p-4 space-y-4">
                {memoryRules.map((rule) => (
                  <Card key={rule.category} className="p-4 bg-background/80">
                    <p className="font-medium">{rule.messageType}</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.shouldStore}
                    </p>
                  </Card>
                ))}
                <Card
                  className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:border-primary bg-background/80"
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

        {/* Add Tool Sheet */}
        <Sheet open={isAddingTool} onOpenChange={setIsAddingTool}>
          <SheetContent className="sm:max-w-[400px] w-3/4">
            <SheetHeader>
              <SheetTitle>Add Tool to Agent</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2">
                  {availableTools.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No tools available for this organization. Add tools in
                      Settings first.
                    </div>
                  ) : (
                    availableTools
                      .filter((tool) => !selectedToolIds.has(tool.id)) // Only show unassigned tools
                      .map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleAddTool(tool.id)}
                          className="w-full text-left p-3 rounded-md border transition-colors hover:bg-muted"
                        >
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tool.type}
                          </div>
                          {tool.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {tool.description}
                            </div>
                          )}
                        </button>
                      ))
                  )}
                  {availableTools.filter(
                    (tool) => !selectedToolIds.has(tool.id)
                  ).length === 0 &&
                    availableTools.length > 0 && (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        All available tools have been added to this agent.
                      </div>
                    )}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  )
}
