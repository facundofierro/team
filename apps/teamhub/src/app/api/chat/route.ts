import { NextRequest } from 'next/server'
import { sendChat } from '@teamhub/ai'
import { auth } from '@/auth'
import { db } from '@teamhub/db'
import type { AgentToolPermissions } from '@teamhub/db'

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Chat API: Received chat request')

    // Get authenticated session
    const session = await auth()
    if (!session?.user?.id) {
      console.error('❌ Chat API: Unauthorized request')
      return new Response('Unauthorized', { status: 401 })
    }

    console.log('✅ Chat API: User authenticated:', session.user.id)

    // Get user's organization
    const organizations = await db.getOrganizations(session.user.id)
    if (!organizations.length) {
      console.error('❌ Chat API: No organization found for user')
      return new Response('No organization found', { status: 403 })
    }

    console.log('✅ Chat API: Organization found:', organizations[0].id)

    const { messages, summary, agentId, agentCloneId, memoryRules, storeRule } =
      await req.json()

    console.log('📋 Chat API: Request data:', {
      messagesCount: messages?.length,
      agentId,
      agentCloneId,
      hasMemoryRules: !!memoryRules,
      hasStoreRule: !!storeRule,
      hasSummary: !!summary,
    })

    // Validate required parameters
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ Chat API: Invalid or missing messages parameter')
      return new Response('Messages array is required', { status: 400 })
    }

    if (!agentId || typeof agentId !== 'string') {
      console.error('❌ Chat API: Invalid or missing agentId parameter')
      return new Response('Agent ID is required', { status: 400 })
    }

    console.log('🤖 Chat API: Getting agent details...')
    // Get agent with tool permissions
    const agent = await db.getAgent(agentId)
    if (!agent) {
      console.error('❌ Chat API: Agent not found:', agentId)
      return new Response('Agent not found', { status: 404 })
    }

    console.log('✅ Chat API: Agent found:', agent.name)

    // Extract agent tool permissions
    const agentToolPermissions = agent.toolPermissions as AgentToolPermissions
    const toolPermissions = agentToolPermissions?.rules || []

    console.log(
      '🔧 Chat API: Agent tool permissions count:',
      toolPermissions.length
    )
    console.log(
      '🔧 Chat API: Agent tool permissions:',
      toolPermissions.map((permission) => ({
        toolId: permission.toolId,
        maxUsagePerDay: permission.maxUsagePerDay,
        role: permission.role,
      }))
    )

    // Get actual tools from toolIds and create extended tool permissions
    const activeTools = []
    if (toolPermissions.length > 0) {
      console.log('🔧 Chat API: Fetching tool details...')

      for (const permission of toolPermissions) {
        try {
          const tool = await db.getTool(permission.toolId)
          if (tool && tool.isActive) {
            console.log(
              `🔧 Chat API: Found active tool: ${tool.name} (${tool.type})`
            )
            activeTools.push({
              ...permission,
              id: tool.id,
              type: tool.type,
              name: tool.name,
              configuration: tool.configuration,
              isActive: tool.isActive,
              isManaged: tool.isManaged,
            })
          } else {
            console.warn(
              `⚠️ Chat API: Tool not found or inactive: ${permission.toolId}`
            )
          }
        } catch (error) {
          console.error(
            `❌ Chat API: Error fetching tool ${permission.toolId}:`,
            error
          )
        }
      }
    }

    console.log('🔧 Chat API: Active tools count:', activeTools.length)

    if (activeTools.length > 0) {
      console.log(
        '🔧 Chat API: Active tools details:',
        activeTools.map((tool) => ({
          id: tool.id,
          type: tool.type,
          name: tool.name,
          isManaged: tool.isManaged,
          hasConfiguration: !!tool.configuration,
          configurationKeys: Object.keys(tool.configuration || {}),
        }))
      )
    }

    console.log('🚀 Chat API: Calling sendChat with tools...')

    // Call sendChat with tools and return the promise for the stream
    return sendChat({
      databaseName: organizations[0].databaseName,
      messages,
      summary,
      agentId,
      agentCloneId,
      memoryRules,
      storeRule,
      tools: activeTools,
    })
  } catch (error) {
    console.error('💥 Chat API: Error processing request:', error)
    console.error(
      '💥 Chat API: Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    )
    return new Response('Internal Server Error', { status: 500 })
  }
}
