import { SimpleReactiveTest } from '../../../components/agents/SimpleReactiveTest'
import { Card } from '../../../components/ui/card'
import { ReactiveProviderWrapper } from '../../../components/providers/ReactiveProviderWrapper'
import { redirect } from 'next/navigation'

// Define relations inline to avoid importing database modules on server component
const reactiveRelations = {
  agent: ['organization.id', 'message.fromAgentId', 'message.toAgentId'],
  organization: ['agent.organizationId', 'tool.organizationId'],
  message: ['agent.fromAgentId', 'agent.toAgentId'],
  tool: ['organization.id'],
  user: ['organization.userId'],
  message_type: ['organization.id'],
  tool_type: [],
  cron: ['organization.id', 'message.messageId'],
}

type PageProps = {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function ReactiveAgentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : undefined

  if (!organizationId) {
    redirect('/')
  }

  return (
    <ReactiveProviderWrapper
      organizationId={organizationId}
      relations={reactiveRelations}
    >
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'rgb(237, 234, 224)' }}
      >
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🚀 Reactive Agents Demo</h1>
            <p className="text-gray-600 mb-6">
              Testing @drizzle/reactive/client with real-time updates and tRPC
              integration
            </p>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">
                🚀 Features Demo
              </h3>
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
                  • <strong>Smart Invalidation:</strong> Only relevant queries
                  are updated
                </li>
                <li>
                  • <strong>Type Safety:</strong> Full TypeScript support with
                  tRPC
                </li>
                <li>
                  • <strong>Offline Ready:</strong> Graceful handling of network
                  issues
                </li>
              </ul>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simple Reactive Test */}
            <div>
              <SimpleReactiveTest organizationId={organizationId} />
            </div>

            {/* Instructions & Debug */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">📋 How to Test:</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Click &quot;Add Agent&quot; to create a new agent</li>
                  <li>Open this page in another browser tab</li>
                  <li>
                    Create an agent in one tab and watch it appear in the other
                  </li>
                  <li>
                    Notice the &quot;Syncing...&quot; indicator during updates
                  </li>
                  <li>Check the browser console for detailed logs</li>
                </ol>
              </Card>

              <Card className="p-4 bg-gray-50">
                <h3 className="font-medium mb-2">🔧 Debug Info:</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Organization ID:</strong>{' '}
                    <code className="bg-gray-200 px-1 rounded">
                      {organizationId}
                    </code>
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
          </div>
        </div>
      </div>
    </ReactiveProviderWrapper>
  )
}
