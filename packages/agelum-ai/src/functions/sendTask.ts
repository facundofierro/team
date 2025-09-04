import { createMessage, createCron, reactiveDb } from '@agelum/db'
import type { AgentMemoryRule, AgentToolPermission } from '@agelum/db'
import type { MemoryStoreRule, CronConfig, TaskMetadata } from '../types'

export async function sendTask(params: {
  taskId: string
  metadata: TaskMetadata
  agentId: string
  agentCloneId?: string
  fromAgentId?: string
  organizationId: string // Add required organizationId
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
  tools?: AgentToolPermission[]
  cron?: CronConfig
}) {
  const {
    taskId,
    metadata,
    agentId,
    agentCloneId,
    fromAgentId,
    organizationId,
    storeRule,
    cron,
  } = params

  const message = await createMessage.execute(
    {
      id: crypto.randomUUID(),
      fromAgentId: fromAgentId || null,
      toAgentId: agentId,
      toAgentCloneId: agentCloneId,
      type: 'task',
      content: taskId,
      organizationId,
      metadata,
      status: 'pending',
    },
    reactiveDb
  )

  if (cron) {
    await createCron.execute(
      {
        id: crypto.randomUUID(),
        organizationId,
        messageId: message.id,
        schedule: cron.schedule,
        isActive: true,
        nextRun: cron.startDate || new Date(),
      },
      reactiveDb
    )
  }

  return message
}
