'use client'

import { Plus } from 'lucide-react'
import type { Agent as DBAgent } from '@teamhub/db'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import type { AgentStore } from '@/stores/agentStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { OrganizationStore } from '@/stores/organizationStore'
import { useReactive } from '@drizzle/reactive/client'
import { AgentsList as UXAgentsList } from '@teamhub/ux-core'
import type { Agent as UXAgent } from '@teamhub/ux-core'

type AgentsListProps = {
  organizationId: string
}

// Transform DB Agent to UX Agent format
function transformAgent(dbAgent: DBAgent): UXAgent {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    description: dbAgent.role || 'No role provided',
    status: dbAgent.isActive ? 'active' : 'idle',
    avatar: undefined, // No avatar field in DB schema
    parentId: dbAgent.parentId || undefined,
    children: [], // Will be populated by buildAgentTree
  }
}

// Build agent tree structure
function buildAgentTree(agents: DBAgent[]): UXAgent[] {
  const agentMap = new Map<string, UXAgent>()
  const roots: UXAgent[] = []

  // First pass: create nodes
  agents.forEach((agent) => {
    agentMap.set(agent.id, transformAgent(agent))
  })

  // Second pass: build tree relationships
  agents.forEach((agent) => {
    const node = agentMap.get(agent.id)!
    if (agent.parentId) {
      const parent = agentMap.get(agent.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function AgentsList({ organizationId }: AgentsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const setSelectedAgentId = useAgentStore(
    (state: AgentStore) => state.setSelectedAgentId
  )
  const selectedAgentId = useAgentStore(
    (state: AgentStore) => state.selectedAgentId
  )
  const currentOrganization = useOrganizationStore(
    (state: OrganizationStore) => state.currentOrganization
  )

  // 🚀 REACTIVE: Use useReactive for agents data
  const {
    data: agents = [],
    isLoading,
    isStale,
  } = useReactive<DBAgent[]>('agents.getAll', { organizationId })

  // Reduced logging - only log when there are significant changes
  if (agents.length === 0 && !isLoading) {
    console.log(
      '🔄 [AgentsList] No agents found for organization:',
      organizationId
    )
  }

  const handleAgentSelect = (agent: UXAgent) => {
    console.log(
      '🔄 [AgentsList] Agent selected:',
      agent.id,
      'Current selectedAgentId:',
      selectedAgentId
    )

    // Always update the selection
    setSelectedAgentId(agent.id)

    // Create new URL preserving existing params
    const params = new URLSearchParams(searchParams)
    params.set('id', agent.id)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleCreateAgent = () => {
    startTransition(() => {
      try {
        // Create the agent using the reactive function
        const newAgentData = {
          id: crypto.randomUUID(),
          name: 'New Agent',
          role: 'assistant',
          parentId: searchParams.get('id') || null,
          doesClone: false,
          systemPrompt: '',
          maxInstances: 1,
          policyDefinitions: {},
          memoryRules: {},
          toolPermissions: { rules: [] },
          isActive: true,
          organizationId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        console.log('Creating agent:', newAgentData.name)

        // For now, just update the store and redirect
        setSelectedAgentId(newAgentData.id)
        router.push(`/agents?id=${newAgentData.id}&tab=settings`, {
          scroll: false,
        })
      } catch (error) {
        console.error('Failed to create agent:', error)
      }
    })
  }

  // Transform agents to UX format and build tree
  const uxAgents = buildAgentTree(agents)

  if (isLoading) {
    return (
      <div className="flex flex-col h-full text-white bg-neutral-600 p-4">
        <div className="flex-1">
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded animate-pulse bg-neutral-500"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show empty state if no agents exist
  if (agents.length === 0) {
    return (
      <div className="flex flex-col h-full text-white bg-neutral-600 p-4">
        <div className="flex flex-col flex-1 justify-center items-center text-center">
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              No Agents Yet
            </h3>
            <p className="text-sm text-gray-300">
              Create your first AI agent to get started
            </p>
          </div>

          {!!currentOrganization?.id && (
            <button
              onClick={handleCreateAgent}
              className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create First Agent</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full text-white bg-neutral-600 p-4">
      <UXAgentsList
        agents={uxAgents}
        onAgentSelect={handleAgentSelect}
        onAgentCreate={handleCreateAgent}
        selectedAgentId={selectedAgentId || searchParams.get('id') || undefined}
        showHierarchical={true}
        showSearch={true}
        showActionButtons={true}
        className="h-full bg-transparent border-0 shadow-none"
      />
    </div>
  )
}
