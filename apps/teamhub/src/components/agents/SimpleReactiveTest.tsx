'use client'

import { useState } from 'react'
import { useReactive } from '@drizzle/reactive/client'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Plus, Loader2 } from 'lucide-react'

interface SimpleReactiveTestProps {
  organizationId: string
}

export function SimpleReactiveTest({
  organizationId,
}: SimpleReactiveTestProps) {
  const [testCount, setTestCount] = useState(0)

  // Test the reactive hook
  const {
    data: agents,
    isLoading,
    isStale,
    error,
    refetch,
  } = useReactive('agents.getAll', { organizationId }) as {
    data: any[] | undefined
    isLoading: boolean
    isStale: boolean
    error: Error | null
    refetch: () => void
  }

  const handleTest = async () => {
    console.log('🧪 Testing reactive hook...')
    setTestCount((count) => count + 1)

    // Test refetch
    try {
      await refetch()
      console.log('✅ Refetch successful')
    } catch (err) {
      console.error('❌ Refetch failed:', err)
    }
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Simple Reactive Test</h2>
          {isStale && (
            <div className="text-orange-500 text-sm flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm font-medium text-blue-900">Status</div>
            <div className="text-blue-800">
              {isLoading ? 'Loading...' : 'Ready'}
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <div className="text-sm font-medium text-green-900">Data Count</div>
            <div className="text-green-800">
              {agents ? agents.length : 'N/A'}
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded">
            <div className="text-sm font-medium text-purple-900">
              Test Count
            </div>
            <div className="text-purple-800">{testCount}</div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-900">Cache State</div>
            <div className="text-gray-800">{isStale ? 'Stale' : 'Fresh'}</div>
          </div>
        </div>

        <Button onClick={handleTest} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Test Reactive Hook
        </Button>

        {agents && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Raw Data:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(agents, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>
            <strong>Organization ID:</strong> {organizationId}
          </p>
          <p>
            <strong>Hook Name:</strong> agents.getAll
          </p>
          <p>
            <strong>Provider:</strong> @drizzle/reactive/client
          </p>
        </div>
      </div>
    </Card>
  )
}
