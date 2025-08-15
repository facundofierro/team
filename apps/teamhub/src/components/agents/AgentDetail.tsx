'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import { ChatCard } from '@/components/agents/agentDetails/ChatCard'
import { DashboardCard } from './agentDetails/DashboardCard'
import { SettingsCard } from './agentDetails/SettingsCard'
import type { Agent, ToolWithTypes } from '@teamhub/db'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Skeleton } from '../../components/ui/skeleton'
import { useEffect, useState } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { Button } from '../../components/ui/button'
import { MemoryCard } from './agentDetails/MemoryCard'
import { useReactive } from '@drizzle/reactive/client'

type AgentDetailProps = {
  defaultTab?: string
  organizationId: string
}

export function AgentDetail({
  defaultTab = 'chat',
  organizationId,
}: AgentDetailProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentId = searchParams.get('id')
  const activeTab = useAgentStore((state) => state.activeTab)
  const setActiveTab = useAgentStore((state) => state.setActiveTab)
  const selectedAgentId = useAgentStore((state) => state.selectedAgentId)
  const selectedAgent = useAgentStore((state) => state.selectedAgent)
  const setSelectedAgent = useAgentStore((state) => state.setSelectedAgent)
  const [hasChanges, setHasChanges] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Partial<Agent>>({})
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | undefined>(
    undefined
  )
  const [conversationToLoad, setConversationToLoad] = useState<
    string | undefined
  >(undefined)

  // 🚀 REACTIVE: Get agent data using useReactive
  const {
    data: agent,
    isLoading: agentLoading,
    isStale: agentStale,
  } = useReactive<Agent | null>(
    'agents.getOne',
    currentId ? { id: currentId } : null
  )

  // 🚀 REACTIVE: Get organization settings using useReactive
  const { data: organizationSettings, isLoading: settingsLoading } =
    useReactive<{
      tools: ToolWithTypes[]
      messageTypes: any[]
      toolTypes: any[]
      users: any[]
    }>('organizations.settings.getAll', { organizationId })

  const availableTools = organizationSettings?.tools || []

  // Reduced logging - only log when agent changes or when there are issues
  if (agent && !agentLoading) {
    console.log(
      '🔄 [AgentDetail] Agent loaded:',
      agent.name,
      '(ID:',
      agent.id.substring(0, 8) + '...)'
    )
  }

  // Update store when agent data arrives or changes
  useEffect(() => {
    if (agent) {
      console.log('🔄 [AgentDetail] Setting agent in store:', agent.name)
      setSelectedAgent(agent)
      setHasChanges(false)
      setPendingChanges({})
    }
  }, [agent, setSelectedAgent])

  // Initialize tab from URL only once
  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) {
      setActiveTab(urlTab)
    }
  }, [searchParams, setActiveTab])

  const handleChange = async (changes: Partial<Agent>) => {
    // Include all previous pending changes when updating
    const updatedChanges = { ...pendingChanges, ...changes }
    setHasChanges(true)
    setPendingChanges(updatedChanges)
    return Promise.resolve()
  }

  const handleSave = async () => {
    if (!selectedAgent?.id) return

    // Ensure we're sending the ID with the changes
    const changes = {
      id: selectedAgent.id,
      ...pendingChanges,
    }

    // TODO: In the future, this will use tRPC mutations
    console.log('💾 [AgentDetail] Would save agent changes:', changes)

    setHasChanges(false)
    setPendingChanges({})
  }

  const handleCancel = () => {
    setHasChanges(false)
    setPendingChanges({})
    setSelectedAgent(agent || null) // Convert undefined to null
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleOpenConversation = (conversationId: string) => {
    console.log('🔄 Opening conversation:', conversationId)
    // Switch to chat tab
    setActiveTab('chat')
    // Set conversation to load (ChatCard will pick this up)
    setConversationToLoad(conversationId)
  }

  if (!selectedAgentId) {
    return (
      <div
        className="flex flex-col h-full p-6"
        style={{ backgroundColor: 'rgb(237, 234, 224)' }}
      ></div>
    )
  }

  // Show loading if we have an ID but no agent data
  if (selectedAgentId && !agent && agentLoading) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  // Show message if no agent is selected
  if (!agent) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Agent Selected
          </h3>
          <p className="text-gray-600">
            Select an agent from the list to view details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with save/cancel buttons */}
      {hasChanges && (
        <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
          <span className="text-sm text-yellow-800">
            You have unsaved changes
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Agent stale indicator */}
      {agentStale && (
        <div className="p-2 bg-blue-50 border-b border-blue-200">
          <div className="text-xs text-blue-800 flex items-center gap-1">
            🔄 Syncing latest agent data...
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex h-full flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent
            value="chat"
            className="flex-1 min-h-0 overflow-hidden p-0"
          >
            <ChatCard
              conversationToLoad={conversationToLoad}
              onConversationLoaded={() => setConversationToLoad(undefined)}
            />
          </TabsContent>

          <TabsContent
            value="dashboard"
            className="flex-1 min-h-0 overflow-hidden p-0"
          >
            <DashboardCard />
          </TabsContent>

          <TabsContent
            value="memory"
            className="flex-1 min-h-0 overflow-hidden p-0"
          >
            <MemoryCard
              agentId={agent.id}
              selectedMemoryId={selectedMemoryId}
              onMemorySelect={setSelectedMemoryId}
              onConversationOpen={handleOpenConversation}
            />
          </TabsContent>

          <TabsContent
            value="settings"
            className="flex-1 min-h-0 overflow-hidden p-0"
          >
            <SettingsCard
              agent={agent}
              onChange={handleChange}
              availableTools={availableTools}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
