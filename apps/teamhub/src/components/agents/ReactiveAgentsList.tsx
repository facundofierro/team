'use client'

import { useReactive } from '@drizzle/reactive/client'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus, Loader2 } from 'lucide-react'
import type { Agent } from '@teamhub/db'

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
  } = useReactive('agents.getAll', { organizationId }) as {
    data: Agent[] | undefined
    isLoading: boolean
    isStale: boolean
    error: Error | null
    refetch: () => void
  }

  const handleCreateAgent = async () => {
    try {
      // For now, let's just test the reactive hooks without tRPC mutation
      // The cache will still update automatically when data changes
      console.log(
        '🚀 Testing reactive hooks - agent creation would trigger cache updates'
      )

      // Simulate a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Force refetch to test cache invalidation
      refetch()
    } catch (error) {
      console.error('❌ Failed to create agent:', error)
    }
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
        <Button onClick={handleCreateAgent} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Test Reactive
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
            agents.map((agent: Agent) => (
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
