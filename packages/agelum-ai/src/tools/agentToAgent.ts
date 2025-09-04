import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'
import {
  getAgent,
  createCron,
  createMessage,
  updateMessage,
  reactiveDb,
} from '@agelum/db'
import { log } from '@repo/logger'

export type A2AParameters = {
  targetAgentId: string
  messageType:
    | 'task'
    | 'response'
    | 'workflow'
    | 'notification'
    | 'request'
    | 'status_update'
  content: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  metadata?: {
    originalConversationId?: string
    taskId?: string
    workflowId?: string
    responseToMessageId?: string
    scheduledFor?: string // ISO string for scheduled execution
    expiresAt?: string // ISO string for message expiration
    tags?: string[]
    attachments?: Array<{
      type: string
      data: unknown
    }>
  }
}

export type A2AResult = {
  success: boolean
  messageId: string
  conversationId?: string
  scheduledJobId?: string
  targetAgent: {
    id: string
    name: string
    isActive: boolean
  }
  deliveryStatus: 'delivered' | 'scheduled' | 'failed'
  message: string
}

export const agentToAgent: ToolTypeDefinition = {
  id: 'agentToAgent',
  type: 'agentToAgent',
  description:
    'Send messages, tasks, and workflow instructions to other agents within the organization. Supports immediate delivery, scheduling, and different message types for various agent communication scenarios.',
  canBeManaged: false, // Internal tool, no external API costs
  managedPrice: 0,
  managedPriceDescription: 'Internal agent communication - no cost',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 10000, // High limit for internal communication
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    // No external configuration needed - uses organization context
  },
  parametersSchema: z.object({
    targetAgentId: z
      .string()
      .describe('ID of the target agent to send message to'),
    messageType: z
      .enum([
        'task',
        'response',
        'workflow',
        'notification',
        'request',
        'status_update',
      ])
      .describe('Type of message being sent'),
    content: z
      .string()
      .min(1)
      .describe('The message content to send to the target agent'),
    priority: z
      .enum(['low', 'normal', 'high', 'urgent'])
      .default('normal')
      .describe('Priority level of the message'),
    metadata: z
      .object({
        originalConversationId: z
          .string()
          .optional()
          .describe('ID of the original conversation if this is a response'),
        taskId: z
          .string()
          .optional()
          .describe('Unique task identifier for task messages'),
        workflowId: z
          .string()
          .optional()
          .describe('Workflow identifier for multi-agent workflows'),
        responseToMessageId: z
          .string()
          .optional()
          .describe('ID of the message this is responding to'),
        scheduledFor: z
          .string()
          .optional()
          .describe('ISO string for scheduled message delivery'),
        expiresAt: z
          .string()
          .optional()
          .describe('ISO string for message expiration'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Tags for message categorization'),
        attachments: z
          .array(
            z.object({
              type: z.string().describe('Type of attachment'),
              data: z.unknown().describe('Attachment data'),
            })
          )
          .optional()
          .describe('File or data attachments'),
      })
      .optional()
      .describe('Additional metadata for the message'),
  }),
  resultSchema: z.object({
    success: z
      .boolean()
      .describe('Whether the message was successfully processed'),
    messageId: z.string().describe('Unique ID of the created message'),
    conversationId: z
      .string()
      .optional()
      .describe('ID of the conversation created'),
    scheduledJobId: z
      .string()
      .optional()
      .describe('ID of scheduled job if message was scheduled'),
    targetAgent: z
      .object({
        id: z.string().describe('Target agent ID'),
        name: z.string().describe('Target agent name'),
        isActive: z.boolean().describe('Whether target agent is active'),
      })
      .describe('Information about the target agent'),
    deliveryStatus: z
      .enum(['delivered', 'scheduled', 'failed'])
      .describe('Status of message delivery'),
    message: z.string().describe('Human-readable status message'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<A2AResult> => {
    log.agelumAi.tool.info('A2A Communication Tool: Starting execution')
    log.agelumAi.tool.debug('A2A Tool: Received params', undefined, {
      params: JSON.stringify(params, null, 2),
    })

    const {
      targetAgentId,
      messageType,
      content,
      priority,
      metadata = {},
    } = params as A2AParameters

    try {
      // First, verify the target agent exists and is active
      const targetAgent = await getAgent.execute(
        { id: targetAgentId },
        reactiveDb
      )
      if (!targetAgent) {
        throw new Error(`Target agent with ID ${targetAgentId} not found`)
      }

      if (!targetAgent.isActive) {
        log.agelumAi.tool.warn(
          'A2A Tool: Target agent is not active',
          undefined,
          {
            targetAgentId,
          }
        )
        return {
          success: false,
          messageId: '',
          targetAgent: {
            id: targetAgent.id,
            name: targetAgent.name,
            isActive: targetAgent.isActive,
          },
          deliveryStatus: 'failed',
          message: `Target agent ${targetAgent.name} is not active`,
        }
      }

      log.agelumAi.tool.info('A2A Tool: Target agent found', undefined, {
        targetAgentId,
        targetAgentName: targetAgent.name,
      })

      // Generate unique message ID
      const messageId = `a2a_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}`

      // Check if this is a scheduled message
      const scheduledFor = metadata.scheduledFor
        ? new Date(metadata.scheduledFor)
        : null
      const isScheduled = scheduledFor && scheduledFor > new Date()

      if (isScheduled) {
        log.agelumAi.tool.info('A2A Tool: Scheduling message', undefined, {
          targetAgentId,
          scheduledFor: scheduledFor.toISOString(),
        })

        // Create a cron job for scheduled delivery
        const cronJob = await createCron.execute(
          {
            id: `a2a_cron_${messageId}`,
            organizationId: targetAgent.organizationId!,
            messageId: messageId,
            schedule: `${scheduledFor.getMinutes()} ${scheduledFor.getHours()} ${scheduledFor.getDate()} ${
              scheduledFor.getMonth() + 1
            } *`,
            isActive: true,
            nextRun: scheduledFor,
          },
          reactiveDb
        )

        // Create the message with pending status
        await createMessage.execute(
          {
            id: messageId,
            organizationId: targetAgent.organizationId!,
            fromAgentId: null, // Will be filled when executed
            toAgentId: targetAgentId,
            type: `a2a_${messageType}`,
            content: content,
            metadata: {
              ...metadata,
              priority,
              originalMessageType: messageType,
              isA2AMessage: true,
              scheduledFor: scheduledFor.toISOString(),
            },
            status: 'scheduled',
          },
          reactiveDb
        )

        return {
          success: true,
          messageId,
          scheduledJobId: cronJob.id,
          targetAgent: {
            id: targetAgent.id,
            name: targetAgent.name,
            isActive: targetAgent.isActive,
          },
          deliveryStatus: 'scheduled',
          message: `Message scheduled for delivery to ${
            targetAgent.name
          } at ${scheduledFor.toISOString()}`,
        }
      }

      // For immediate delivery, create message and start conversation
      log.agelumAi.tool.info(
        'A2A Tool: Delivering immediate message',
        undefined,
        {
          targetAgentId,
          targetAgentName: targetAgent.name,
        }
      )

      // Create the message record
      const message = await createMessage.execute(
        {
          id: messageId,
          organizationId: targetAgent.organizationId!,
          fromAgentId: null, // The current agent context will be determined by the conversation
          toAgentId: targetAgentId,
          type: `a2a_${messageType}`,
          content: content,
          metadata: {
            ...metadata,
            priority,
            originalMessageType: messageType,
            isA2AMessage: true,
            deliveredAt: new Date().toISOString(),
          },
          status: 'delivered',
        },
        reactiveDb
      )

      // Create or get the organization's database name for memory functions
      const orgDatabaseName = targetAgent.organizationId || 'agelum' // fallback

      // Start a new conversation for the target agent if this is a task/workflow
      let conversationId: string | undefined

      if (['task', 'workflow', 'request'].includes(messageType)) {
        log.agelumAi.tool.info(
          'A2A Tool: Creating new conversation',
          undefined,
          {
            targetAgentId,
            messageType,
          }
        )

        // Import the memory functions dynamically to avoid circular dependencies
        const { dbMemories } = await import('@agelum/db')
        const memoryFunctions = await dbMemories(orgDatabaseName)

        // Format the message for conversation context
        let conversationTitle: string
        let conversationContent: string

        switch (messageType) {
          case 'task':
            conversationTitle = `Task: ${content.substring(0, 50)}${
              content.length > 50 ? '...' : ''
            }`
            conversationContent = `You have received a new task:

**Priority:** ${priority.toUpperCase()}
**Task:** ${content}

${metadata.taskId ? `**Task ID:** ${metadata.taskId}` : ''}
${metadata.tags ? `**Tags:** ${metadata.tags.join(', ')}` : ''}

Please acknowledge this task and begin working on it.`
            break

          case 'workflow':
            conversationTitle = `Workflow: ${content.substring(0, 50)}${
              content.length > 50 ? '...' : ''
            }`
            conversationContent = `You are part of a multi-agent workflow:

**Priority:** ${priority.toUpperCase()}
**Workflow ID:** ${metadata.workflowId || 'N/A'}
**Your Part:** ${content}

${metadata.tags ? `**Tags:** ${metadata.tags.join(', ')}` : ''}

Please complete your part of the workflow and pass it to the next agent if specified.`
            break

          case 'request':
            conversationTitle = `Request: ${content.substring(0, 50)}${
              content.length > 50 ? '...' : ''
            }`
            conversationContent = `You have received a request from another agent:

**Priority:** ${priority.toUpperCase()}
**Request:** ${content}

${metadata.tags ? `**Tags:** ${metadata.tags.join(', ')}` : ''}

Please review and respond to this request.`
            break

          default:
            conversationTitle = `A2A Message: ${content.substring(0, 50)}${
              content.length > 50 ? '...' : ''
            }`
            conversationContent = content
        }

        // Create the conversation
        const newConversation = await memoryFunctions.startNewConversation(
          targetAgentId,
          null, // agentCloneId
          'system', // userId - using system as placeholder for A2A messages
          conversationContent
        )

        conversationId = newConversation.id
        log.agelumAi.tool.info('A2A Tool: Created conversation', undefined, {
          targetAgentId,
          conversationId,
          messageType,
        })

        // Update the message with conversation reference
        const currentMetadata =
          (message.metadata as Record<string, unknown>) || {}
        await updateMessage.execute(
          {
            id: messageId,
            data: {
              metadata: {
                ...currentMetadata,
                conversationId,
              },
            },
          },
          reactiveDb
        )
      } else {
        // For other message types (response, notification, status_update), just log them
        log.agelumAi.tool.info(
          'A2A Tool: Message delivered without conversation',
          undefined,
          {
            targetAgentId,
            messageType,
          }
        )
      }

      log.agelumAi.tool.info(
        'A2A Tool: Successfully delivered message',
        undefined,
        {
          targetAgentId,
          targetAgentName: targetAgent.name,
          messageType,
        }
      )

      return {
        success: true,
        messageId,
        conversationId,
        targetAgent: {
          id: targetAgent.id,
          name: targetAgent.name,
          isActive: targetAgent.isActive,
        },
        deliveryStatus: 'delivered',
        message: `Message successfully delivered to ${targetAgent.name}${
          conversationId ? ` and conversation ${conversationId} created` : ''
        }`,
      }
    } catch (error) {
      log.agelumAi.tool.error('A2A Tool: Error occurred', undefined, {
        error,
        targetAgentId,
      })

      return {
        success: false,
        messageId: '',
        targetAgent: {
          id: targetAgentId,
          name: 'Unknown',
          isActive: false,
        },
        deliveryStatus: 'failed',
        message: `Failed to deliver message: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }
    }
  },
}
