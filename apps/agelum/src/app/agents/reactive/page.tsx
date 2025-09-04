import { SimpleReactiveTest } from '../../../components/agents/SimpleReactiveTest'
import { Card } from '../../../components/ui/card'
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'rgb(237, 234, 224)' }}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Reactive Agents Demo
          </h1>
          <p className="text-lg text-gray-600">
            Testing @drizzle/reactive/client with real localStorage persistence
            and reactive updates
          </p>
        </div>

        <div className="mb-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Features Demo
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-blue-800">✅ Instant Cache:</strong>{' '}
                Data loads immediately from localStorage
              </div>
              <div>
                <strong className="text-blue-800">✅ Real-time Updates:</strong>{' '}
                Changes sync across all clients via events
              </div>
              <div>
                <strong className="text-blue-800">
                  ✅ Smart Invalidation:
                </strong>{' '}
                Only relevant queries are updated
              </div>
              <div>
                <strong className="text-blue-800">✅ Type Safety:</strong> Full
                TypeScript support with reactive hooks
              </div>
              <div>
                <strong className="text-blue-800">✅ Offline Ready:</strong>{' '}
                Graceful handling of network issues
              </div>
              <div>
                <strong className="text-blue-800">
                  ✅ Persistent Storage:
                </strong>{' '}
                Data survives page refreshes
              </div>
            </div>
          </Card>
        </div>

        <SimpleReactiveTest organizationId={organizationId} />
      </div>
    </div>
  )
}
