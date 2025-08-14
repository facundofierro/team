'use client'

import { ReactiveAgentsList } from '@/components/agents/ReactiveAgentsList'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ReactiveAgentsPage() {
  const searchParams = useSearchParams()
  const organizationId = searchParams.get('organizationId')

  if (!organizationId) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <h1 className="text-xl font-bold mb-4">Reactive Agents Demo</h1>
          <p className="text-gray-600 mb-4">
            Organization ID is required to demo reactive features.
          </p>
          <p className="text-sm text-gray-500">
            Add ?organizationId=your-org-id to the URL
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/agents">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Reactive Agents Demo</h1>
            <p className="text-gray-600">
              Real-time agents with @drizzle/reactive
            </p>
          </div>
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">🚀 Features Demo</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Instant Cache:</strong> Data loads immediately from
              cache
            </li>
            <li>
              • <strong>Real-time Updates:</strong> Changes sync across all
              clients via SSE
            </li>
            <li>
              • <strong>Smart Invalidation:</strong> Only relevant queries are
              updated
            </li>
            <li>
              • <strong>Type Safety:</strong> Full TypeScript support with tRPC
            </li>
            <li>
              • <strong>Offline Ready:</strong> Graceful handling of network
              issues
            </li>
          </ul>
        </Card>
      </div>

      {/* Reactive Agents List */}
      <ReactiveAgentsList organizationId={organizationId} />

      {/* Instructions */}
      <Card className="mt-6 p-4 bg-gray-50">
        <h3 className="font-medium mb-2">🧪 Try These Actions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>1. Click "Add Agent" to create a new agent</li>
          <li>2. Open this page in another browser tab</li>
          <li>
            3. Create an agent in one tab and watch it appear in the other
          </li>
          <li>4. Notice the "Syncing..." indicator during updates</li>
          <li>5. Check the browser console for detailed logs</li>
        </ul>
      </Card>

      {/* Debug Info */}
      <Card className="mt-4 p-4 bg-gray-50">
        <h3 className="font-medium mb-2">🔧 Debug Info:</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Organization ID:</strong>{' '}
            <code className="bg-gray-200 px-1 rounded">{organizationId}</code>
          </p>
          <p>
            <strong>SSE Endpoint:</strong>{' '}
            <code className="bg-gray-200 px-1 rounded">
              /api/events?organizationId={organizationId}
            </code>
          </p>
          <p>
            <strong>tRPC Endpoint:</strong>{' '}
            <code className="bg-gray-200 px-1 rounded">/api/trpc</code>
          </p>
          <p>
            <strong>Redis URL:</strong>{' '}
            <code className="bg-gray-200 px-1 rounded">
              redis://192.168.88.135:6379
            </code>
          </p>
        </div>
      </Card>
    </div>
  )
}
