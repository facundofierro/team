'use client'

import { Button } from '../../components/ui/button'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import type { Agent } from '@teamhub/db'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Card } from '../../components/ui/card'
import { ScrollArea } from '../../components/ui/scroll-area'
import { useState, useEffect, useTransition } from 'react'
import { useAgentStore } from '@/stores/agentStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import { useReactive } from '@drizzle/reactive/client'

type AgentTreeNode = Agent & {
  children: AgentTreeNode[]
}

type AgentsListProps = {
  organizationId: string
}

function buildAgentTree(agents: Agent[]): AgentTreeNode[] {
  const agentMap = new Map<string, AgentTreeNode>()
  const roots: AgentTreeNode[] = []

  // First pass: create nodes
  agents.forEach((agent) => {
    agentMap.set(agent.id, { ...agent, children: [] })
  })

  // Second pass: build tree
  agents.forEach((agent) => {
    const node = agentMap.get(agent.id)!
    if (agent.parentId) {
      const parent = agentMap.get(agent.parentId)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

function AgentTreeItem({
  agent,
  level = 0,
  selectedId,
  onClick,
}: {
  agent: AgentTreeNode
  level?: number
  selectedId?: string
  onClick: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-1">
      <div className="relative flex items-center">
        {/* Fixed line positioning for each level */}
        {Array.from({ length: level }).map((_, index) => (
          <div
            key={index}
            className="absolute top-[-9px] bottom-[4px] left-0 border-l border-gray-400"
            style={{ left: `${index * 1 + 0.7}rem` }}
          />
        ))}
        <div style={{ width: `${level * 1.5}rem` }} />
        {agent.children.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="relative z-10 w-6 h-6 p-0 border border-gray-400 rounded-full hover:bg-zinc-600/50"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        )}
        <div style={{ width: `2px` }} />
        <Button
          variant={selectedId === agent.id ? 'secondary' : 'ghost'}
          className={`justify-start w-full rounded-2xl text-white hover:bg-zinc-700/50 hover:text-zinc-300 relative z-10 ${
            selectedId === agent.id
              ? 'bg-gray-50 text-slate-900  hover:text-zinc-300 pl-2'
              : ''
          }`}
          onClick={() => onClick(agent.id)}
          style={{
            paddingLeft: agent.children.length === 0 ? '1rem' : '1rem',
          }}
        >
          {agent.name}
        </Button>
      </div>
      {isExpanded && agent.children.length > 0 && (
        <div className="relative">
          {agent.children.map((child) => (
            <AgentTreeItem
              key={child.id}
              agent={child}
              level={level + 1}
              selectedId={selectedId}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function AgentsList({ organizationId }: AgentsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const setSelectedAgentId = useAgentStore((state) => state.setSelectedAgentId)
  const selectedAgentId = useAgentStore((state) => state.selectedAgentId)
  const setSelectedAgent = useAgentStore((state) => state.setSelectedAgent)
  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  )

  // 🚀 REACTIVE: Use useReactive instead of props for agents data
  const {
    data: agents = [],
    isLoading,
    isStale,
  } = useReactive<Agent[]>('agents.getAll', { organizationId })

  console.log('🔄 [AgentsList] Render:', {
    agentCount: agents.length,
    isLoading,
    isStale,
    organizationId,
  })

  const handleAgentClick = (id: string) => {
    // Immediately update UI with basic agent data
    setSelectedAgentId(id)
    setSelectedAgent(null)

    // Create new URL preserving existing params
    const params = new URLSearchParams(searchParams)
    params.set('id', id)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleCreateAgent = async (formData: FormData) => {
    startTransition(() => {
      // For now, we'll use a simple approach - in the future this will use tRPC mutations
      const newAgent: Agent = {
        id: crypto.randomUUID(),
        name: 'New Agent',
        role: 'assistant',
        parentId: formData.get('parentId')?.toString() || null,
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
      } as Agent

      setSelectedAgentId(newAgent.id)
      setSelectedAgent(newAgent)
      // Only for new agents we force the settings tab
      router.push(`/agents?id=${newAgent.id}&tab=settings`, { scroll: false })
    })
  }

  const agentTree = buildAgentTree(agents)

  if (isLoading) {
    return (
      <div className="flex flex-col h-full text-white bg-neutral-600">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-neutral-500 rounded animate-pulse"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full text-white bg-neutral-600">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {isStale && (
            <div className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
              🔄 Syncing latest data...
            </div>
          )}
          {agentTree.map((agent) => (
            <AgentTreeItem
              key={agent.id}
              agent={agent}
              selectedId={
                selectedAgentId || searchParams.get('id') || undefined
              }
              onClick={handleAgentClick}
            />
          ))}
        </div>
      </ScrollArea>

      {!!currentOrganization?.id && (
        <div className="p-4 border-t">
          <form action={handleCreateAgent}>
            <input type="hidden" name="organizationId" value={organizationId} />
            {searchParams.get('id') && (
              <input
                type="hidden"
                name="parentId"
                value={searchParams.get('id') || ''}
              />
            )}
            <Card className="border-dashed cursor-pointer hover:bg-menu2">
              <Button
                variant="ghost"
                className="justify-center w-full h-10 px-4 hover:text-zinc-300"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center">
                    <span className="text-sm">Creating...</span>
                  </div>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm">Add new agent</span>
                  </>
                )}
              </Button>
            </Card>
          </form>
        </div>
      )}
    </div>
  )
}
