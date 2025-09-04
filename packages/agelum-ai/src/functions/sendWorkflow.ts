import type { AgentMemoryRule } from '@agelum/db'
import type { MemoryStoreRule, TaskMetadata } from '../types'
import { sendTask } from './sendTask'

export async function sendWorkflow(params: {
  tasks: Array<{
    taskId: string
    metadata: TaskMetadata
  }>
  agentId: string
  agentCloneId?: string
  fromAgentId?: string
  organizationId: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
}) {
  const { tasks } = params

  const messages = await Promise.all(
    tasks.map((task) =>
      sendTask({
        ...params,
        taskId: task.taskId,
        metadata: task.metadata,
      })
    )
  )

  return messages
}
