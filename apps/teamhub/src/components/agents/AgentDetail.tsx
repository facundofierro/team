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

type AgentDetailProps = {
  defaultTab?: string
  agent?: Agent
  onSave?: (agent: Partial<Agent>) => Promise<void>
  availableTools?: ToolWithTypes[]
}

export function AgentDetail({
  defaultTab = 'chat',
  agent,
  onSave,
  availableTools = [],
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

  // Update store when agent data arrives or changes
  useEffect(() => {
    if (agent) {
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
  }, []) // Empty dependency array - only run once

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

    await onSave?.(changes)
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
  if (selectedAgentId && !selectedAgent) {
    return (
      <div
        className="flex flex-col h-full p-6"
        style={{ backgroundColor: 'rgb(237, 234, 224)' }}
      >
        <Skeleton className="w-full mb-4 h-9" />
        <Skeleton className="h-[calc(100%-3rem)] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'rgb(237, 234, 224)' }}
    >
      <Tabs
        value={activeTab}
        defaultValue={defaultTab}
        className="flex flex-col h-full"
        onValueChange={handleTabChange}
      >
        <div className="px-6 pt-6">
          <TabsList className="flex w-full bg-cardLight">
            <TabsTrigger value="dashboard" className="flex-1">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">
              Chat
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex-1">
              Memory
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 pt-4 overflow-hidden rounded-xl">
          <div className={hasChanges ? 'h-[calc(100%-4rem)]' : 'h-full'}>
            <TabsContent
              value="dashboard"
              className="h-full m-0 rounded-xl"
              style={{ backgroundColor: 'rgb(220, 215, 200)' }}
            >
              <DashboardCard />
            </TabsContent>

            <TabsContent
              value="chat"
              className="h-full m-0 rounded-xl"
              style={{ backgroundColor: 'rgb(220, 215, 200)' }}
            >
              <ChatCard
                conversationToLoad={conversationToLoad}
                onConversationLoaded={() => setConversationToLoad(undefined)}
              />
            </TabsContent>

            <TabsContent
              value="memory"
              className="h-full m-0 rounded-xl"
              style={{ backgroundColor: 'rgb(220, 215, 200)' }}
            >
              <MemoryCard
                agentId={selectedAgent?.id || ''}
                selectedMemoryId={selectedMemoryId}
                onMemorySelect={setSelectedMemoryId}
                onConversationOpen={handleOpenConversation}
              />
            </TabsContent>

            <TabsContent
              value="settings"
              className="h-full m-0 rounded-xl"
              style={{ backgroundColor: 'rgb(220, 215, 200)' }}
            >
              <SettingsCard
                agent={selectedAgent || undefined}
                onChange={handleChange}
                availableTools={availableTools}
              />
            </TabsContent>
          </div>

          {hasChanges && (
            <div
              className="flex items-center justify-end h-16 gap-2 px-4 mt-4 rounded-xl"
              style={{ backgroundColor: 'rgb(220, 215, 200)' }}
            >
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={!selectedAgent}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Save changes
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
