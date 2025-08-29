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
  organizationId: string // Add required organizationId
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
}) {
  const { infoType, content, metadata, agentId, agentCloneId, fromAgentId, organizationId } =
    params

  const message = await createMessage.execute(
    {
      id: crypto.randomUUID(),
      fromAgentId: fromAgentId || null,
      toAgentId: agentId,
      toAgentCloneId: agentCloneId,
      type: 'info',
      content,
      organizationId,
      metadata,
      status: 'pending',
    },
    reactiveDb
  )

  return message
}
