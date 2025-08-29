import { AgentsList } from '../../components/agents/AgentsList'
import { AgentDetail } from '../../components/agents/AgentDetail'
import { getValidatedOrganizationId } from '../../lib/auth-utils'

type PageProps = {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const organizationId = await getValidatedOrganizationId(searchParams)

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: 'rgb(237, 234, 224)' }}
    >
      <div className="border-r w-60">
        <AgentsList organizationId={organizationId} />
      </div>
      <div className="flex-1 h-full">
        <AgentDetail organizationId={organizationId} />
      </div>
    </div>
  )
}
