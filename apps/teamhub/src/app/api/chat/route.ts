import { NextRequest } from 'next/server'
import { sendChat } from '@agelum/ai'
import { auth } from '@/auth'
import { db, getOrganizations, getAgent, getTool, reactiveDb } from '@agelum/db'
import type { AgentToolPermissions } from '@agelum/db'
import { log } from '@repo/logger'

export async function POST(req: NextRequest) {
  try {
    log.agelum.api.info('Received chat request')

    // Get authenticated session
    const session = await auth()
    if (!session?.user?.id) {
      log.agelum.auth.error('Unauthorized chat request')
      return new Response('Unauthorized', { status: 401 })
    }

    log.agelum.auth.info('User authenticated for chat', session.user.id)

    // Get user's organization
    const organizations = await getOrganizations.execute(
      { userId: session.user.id },
      reactiveDb
    )
    if (!organizations.length) {
      log.agelum.auth.error('No organization found for user', session.user.id)
      return new Response('No organization found', { status: 403 })
    }

    log.agelum.auth.info('Organization found for chat', session.user.id, {
      organizationId: organizations[0].id,
    })

    const { messages, summary, agentId, agentCloneId, memoryRules, storeRule } =
      await req.json()

    log.agelum.api.debug('Chat request data', session.user.id, {
      messagesCount: messages?.length,
      agentId,
      agentCloneId,
      hasMemoryRules: !!memoryRules,
      hasStoreRule: !!storeRule,
      hasSummary: !!summary,
    })

    // Validate required parameters
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      log.agelum.api.error(
        'Invalid or missing messages parameter',
        session.user.id
      )
      return new Response('Messages array is required', { status: 400 })
    }

    if (!agentId || typeof agentId !== 'string') {
      log.agelum.api.error(
        'Invalid or missing agentId parameter',
        session.user.id
      )
      return new Response('Agent ID is required', { status: 400 })
    }

    log.agelum.agent.debug('Getting agent details', session.user.id, {
      agentId,
    })
    // Get agent with tool permissions
    const agent = await getAgent.execute({ id: agentId }, reactiveDb)
    if (!agent) {
      log.agelum.agent.error('Agent not found', session.user.id, { agentId })
      return new Response('Agent not found', { status: 404 })
    }

    log.agelum.agent.info('Agent found', session.user.id, {
      agentId,
      agentName: agent.name,
    })

    // Extract agent tool permissions
    const agentToolPermissions = agent.toolPermissions as AgentToolPermissions
    const toolPermissions = agentToolPermissions?.rules || []

    log.agelum.agent.debug('Agent tool permissions count', session.user.id, {
      agentId,
      count: toolPermissions.length,
    })
    log.agelum.agent.debug('Agent tool permissions', session.user.id, {
      agentId,
      permissions: toolPermissions.map((permission) => ({
        toolId: permission.toolId,
        maxUsagePerDay: permission.maxUsagePerDay,
        role: permission.role,
      })),
    })

    // Get actual tools from toolIds and create extended tool permissions
    const activeTools = []
    if (toolPermissions.length > 0) {
      log.agelum.agent.debug('Fetching tool details', session.user.id, {
        agentId,
      })

      for (const permission of toolPermissions) {
        try {
          const tool = await getTool.execute(
            { id: permission.toolId },
            reactiveDb
          )
          if (tool && tool.isActive) {
            log.agelum.agent.info('Found active tool', session.user.id, {
              agentId,
              toolId: tool.id,
              toolName: tool.name,
              toolType: tool.type,
            })
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
            log.agelum.agent.warn(
              'Tool not found or inactive',
              session.user.id,
              {
                agentId,
                toolId: permission.toolId,
              }
            )
          }
        } catch (error) {
          log.agelum.agent.error('Error fetching tool', session.user.id, {
            agentId,
            toolId: permission.toolId,
            error,
          })
        }
      }
    }

    log.agelum.agent.info('Active tools count', session.user.id, {
      agentId,
      count: activeTools.length,
    })

    if (activeTools.length > 0) {
      log.agelum.agent.debug('Active tools details', session.user.id, {
        agentId,
        tools: activeTools.map((tool) => ({
          id: tool.id,
          type: tool.type,
          name: tool.name,
          isManaged: tool.isManaged,
          hasConfiguration: !!tool.configuration,
          configurationKeys: Object.keys(tool.configuration || {}),
        })),
      })
    }

    log.agelum.api.info('Calling sendChat with tools', session.user.id, {
      agentId,
      toolsCount: activeTools.length,
    })

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
    log.agelum.api.error('Error processing chat request', undefined, { error })
    log.agelum.api.error('Error stack trace', undefined, {
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    return new Response('Internal Server Error', { status: 500 })
  }
}
