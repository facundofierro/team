import { AgentsList } from '../../components/agents/AgentsList'
import { AgentDetail } from '../../components/agents/AgentDetail'
import { db, Agent } from '@teamhub/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function createAgent(formData: FormData) {
  'use server'
  const parentId = formData.get('parentId')?.toString()
  const organizationId = formData.get('organizationId')?.toString()

  if (!organizationId) {
    throw new Error('Organization ID is required')
  }

  const newAgent = await db.createAgent({
    id: crypto.randomUUID(),
    name: 'New Agent',
    role: 'assistant',
    parentId: parentId || null,
    doesClone: false,
    systemPrompt: '',
    maxInstances: 1,
    policyDefinitions: {},
    memoryRules: {},
    toolPermissions: {},
    isActive: true,
    organizationId,
  })

  revalidatePath('/agents')
  return newAgent
}

async function updateAgent(agent: Partial<Agent>) {
  'use server'
  if (!agent.id) return

  await db.updateAgent(agent.id, agent)
  revalidatePath('/agents')
}

type PageProps = {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const id = typeof params.id === 'string' ? params.id : undefined
  const tab = typeof params.tab === 'string' ? params.tab : undefined
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : undefined

  if (!organizationId) {
    redirect('/')
  }

  const agents: Agent[] = await db.getAgents(organizationId)
  const selectedAgent = id ? (await db.getAgent(id)) || undefined : undefined

  return (
    <div className="flex h-screen bg-background">
      <div className="border-r w-60">
        <AgentsList
          agents={agents}
          selectedId={id}
          createAgent={createAgent}
          organizationId={organizationId}
        />
      </div>
      <div className="flex-1 h-full bg-background">
        <AgentDetail
          defaultTab={tab}
          agent={selectedAgent}
          onSave={updateAgent}
        />
      </div>
    </div>
  )
}
