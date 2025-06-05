import { NextRequest } from 'next/server'
import { sendChat } from '@teamhub/ai'
import { auth } from '@/auth'
import { db } from '@teamhub/db'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth()
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get user's organization
    const organizations = await db.getOrganizations(session.user.id)
    if (!organizations.length) {
      return new Response('No organization found', { status: 403 })
    }

    const { text, agentId, agentCloneId, memoryRules, storeRule } =
      await req.json()

    // Validate required parameters
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response('Text message is required', { status: 400 })
    }

    if (!agentId || typeof agentId !== 'string') {
      return new Response('Agent ID is required', { status: 400 })
    }

    // Verify agent belongs to user's organization
    const agent = await db.getAgent(agentId)
    if (
      !agent ||
      !organizations.some((org) => org.id === agent.organizationId)
    ) {
      return new Response('Agent not found or access denied', { status: 403 })
    }

    const organization = organizations.find(
      (org) => org.id === agent.organizationId
    )!

    const response = await sendChat({
      databaseName: organization.databaseName,
      text,
      agentId,
      agentCloneId,
      memoryRules,
      storeRule,
    })

    return response
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
