import { createMessage, reactiveDb } from '@teamhub/db'
import type { AgentMemoryRule } from '@teamhub/db'
import type { MemoryStoreRule, TaskMetadata } from '../types'

export async function sendInfo(params: {
  infoType: string
  content: string
  metadata?: TaskMetadata
  agentId: string
  agentCloneId?: string
  fromAgentId?: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
}) {
  const { infoType, content, metadata, agentId, agentCloneId, fromAgentId } =
    params

  const message = await createMessage.execute(
    {
      id: crypto.randomUUID(),
      fromAgentId: fromAgentId || null,
      toAgentId: agentId,
      toAgentCloneId: agentCloneId,
      type: 'info',
      content,
      metadata,
      status: 'pending',
    },
    reactiveDb
  )

  return message
}
