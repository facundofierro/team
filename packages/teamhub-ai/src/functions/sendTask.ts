import { db } from '@teamhub/db'
import type { AgentMemoryRule, AgentToolPermission } from '@teamhub/db'
import type { MemoryStoreRule, CronConfig, TaskMetadata } from '../types'

export async function sendTask(params: {
  taskId: string
  metadata: TaskMetadata
  agentId: string
  agentCloneId?: string
  fromAgentId?: string
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
    storeRule,
    cron,
  } = params

  const message = await db.createMessage({
    id: crypto.randomUUID(),
    fromAgentId: fromAgentId || null,
    toAgentId: agentId,
    toAgentCloneId: agentCloneId,
    type: 'task',
    content: taskId,
    metadata,
    status: 'pending',
  })

  if (cron) {
    await db.createCron({
      id: crypto.randomUUID(),
      messageId: message.id,
      schedule: cron.schedule,
      isActive: true,
      nextRun: cron.startDate || new Date(),
    })
  }

  return message
}
