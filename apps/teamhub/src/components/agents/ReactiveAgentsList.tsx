'use client'

import { useReactive } from '@drizzle/reactive'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface ReactiveAgentsListProps {
  organizationId: string
}

export function ReactiveAgentsList({
  organizationId,
}: ReactiveAgentsListProps) {
  // Use the reactive hook to get agents data
  const {
    data: agents,
    isLoading,
    isStale,
    error,
    refetch,
  } = useReactive('agents.getAll', { organizationId })

  // Use tRPC mutation for creating agents
  const createAgentMutation = trpc.agents.create.useMutation({
    onSuccess: () => {
      // Cache invalidation happens automatically via SSE
      console.log('✅ Agent created successfully')
    },
    onError: (error) => {
      console.error('❌ Failed to create agent:', error)
    },
  })

  const handleCreateAgent = () => {
    createAgentMutation.mutate({
      id: `agent_${Date.now()}`,
      organizationId,
      name: 'New Agent',
      role: 'assistant',
      systemPrompt: 'You are a helpful AI assistant.',
    })
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading agents: {error.message}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Agents</h2>
          {isStale && (
            <div className="text-orange-500 text-sm flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </div>
          )}
        </div>
        <Button
          onClick={handleCreateAgent}
          disabled={createAgentMutation.isPending}
          size="sm"
        >
          {createAgentMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Agent
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && !agents && (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading agents...</p>
        </div>
      )}

      {/* Agents list */}
      {agents && (
        <div className="space-y-3">
          {agents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No agents found.</p>
              <p className="text-sm">Create your first agent to get started.</p>
            </div>
          ) : (
            agents.map((agent: any) => (
              <div
                key={agent.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.role}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {agent.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-400">Inactive</span>
                    )}
                  </div>
                </div>
                {agent.systemPrompt && (
                  <p className="text-sm text-gray-700 mt-2 truncate">
                    {agent.systemPrompt}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Debug info */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>
          Loaded {agents?.length || 0} agents
          {isStale && ' (syncing)'}
          {isLoading && ' (loading)'}
        </p>
      </div>
    </Card>
  )
}
