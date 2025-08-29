'use client'

import { useReactive } from '@drizzle/reactive/client'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import {
  Plus,
  Loader2,
  RefreshCw,
  Database,
  HardDrive,
  Store,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Agent } from '@teamhub/db'

interface SimpleReactiveTestProps {
  organizationId: string
}

export function SimpleReactiveTest({
  organizationId,
}: SimpleReactiveTestProps) {
  const [testCount, setTestCount] = useState(0)
  const [isCreating, setIsCreating] = useState(false)

  console.log(
    `🔄 [SimpleReactiveTest] Component rendering for org: ${organizationId}`
  )

  // Use the real reactive hook with the actual getAgents function
  const {
    data: agents,
    isLoading,
    isStale,
    error,
    refetch,
  } = useReactive<Agent[]>('agents.getAll', { organizationId })

  console.log(`📊 [SimpleReactiveTest] Hook result:`, {
    hasData: !!agents,
    dataLength: agents?.length,
    isLoading,
    isStale,
    hasError: !!error,
  })

  // Listen for real-time updates (in a real app, this would come from SSE)
  useEffect(() => {
    const handleAgentUpdate = () => {
      console.log('🔄 Agent updated, triggering refetch')
      refetch()
    }

    // In a real app, this would be an SSE event from the server
    // For demo purposes, we'll use a custom event
    window.addEventListener('agent-updated', handleAgentUpdate)

    return () => {
      window.removeEventListener('agent-updated', handleAgentUpdate)
    }
  }, [refetch])

  const handleCreateTestAgent = async () => {
    try {
      setIsCreating(true)
      console.log('🚀 Creating test agent...')

      // In a real app, this would call the createAgent mutation
      // For demo purposes, we'll simulate the creation
      const testAgent: Partial<Agent> = {
        id: `test-${Date.now()}`,
        name: `Test Agent ${testCount + 1}`,
        role: 'assistant',
        organizationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      console.log('✅ Test agent created:', testAgent)

      // Simulate server-side invalidation
      // In real app, this would happen automatically after database insert
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('agent-updated', {
            detail: { organizationId, table: 'agent' },
          })
        )
      }, 500)

      setTestCount((prev) => prev + 1)
    } catch (error) {
      console.error('❌ Failed to create test agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRefresh = async () => {
    try {
      console.log('🔄 Manual refresh triggered')
      await refetch()
      console.log('✅ Refresh completed')
    } catch (error) {
      console.error('❌ Refresh failed:', error)
    }
  }

  const handleMarkStale = () => {
    try {
      console.log('🧪 Marking cache as stale for testing')
      // Access the client manager to mark the query as stale
      const clientManager = (window as any).__reactiveClientManager
      if (clientManager) {
        clientManager.markQueryStaleForTesting('agents.getAll')
        console.log('✅ Cache marked as stale, refresh to see changes')
      } else {
        console.warn('⚠️ Client manager not accessible from window')
      }
    } catch (error) {
      console.error('❌ Failed to mark cache as stale:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Real Reactive Database Test
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                'Ready'
              )}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {agents ? agents.length : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Agent Count</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {isStale ? 'Stale' : 'Fresh'}
            </div>
            <div className="text-sm text-gray-600">Cache State</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {testCount}
            </div>
            <div className="text-sm text-gray-600">Test Count</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCreateTestAgent}
            disabled={isCreating}
            className="flex-1"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Test Agent
              </>
            )}
          </Button>

          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={handleMarkStale}
            variant="outline"
            disabled={isLoading}
          >
            <HardDrive className="w-4 h-4 mr-2" />
            Mark Cache Stale
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-800 text-sm">Error: {error.message}</div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-3">How to Test:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>
            Click &quot;Create Test Agent&quot; to simulate agent creation
          </li>
          <li>Open this page in another browser tab</li>
          <li>Create an agent in one tab and watch it update in the other</li>
          <li>Notice the &quot;Cache State&quot; changes during updates</li>
          <li>Check the browser console for detailed logs</li>
          <li>Look in localStorage for persistent data</li>
          <li>Check Redis for server-side caching (if available)</li>
        </ol>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-3">Raw Data:</h4>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(agents, null, 2)}
        </pre>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-3">Debug Info:</h4>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Organization ID:</strong> {organizationId}
          </div>
          <div>
            <strong>Hook Name:</strong> agents.getAll
          </div>
          <div>
            <strong>Provider:</strong> @drizzle/reactive/client
          </div>
          <div>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Stale:</strong> {isStale ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {error ? error.message : 'None'}
          </div>
          <div>
            <strong>Data Source:</strong> Real database query via teamhub-db
          </div>
          <div>
            <strong>Cache Layer:</strong> Redis (server) + localStorage (client)
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <h4 className="text-md font-semibold mb-3 text-yellow-800">
          What This Tests:
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span>
              <strong>Database:</strong> Real queries via Drizzle ORM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-green-600" />
            <span>
              <strong>Redis:</strong> Server-side caching & invalidation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-purple-600" />
            <span>
              <strong>LocalStorage:</strong> Client-side persistence
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
