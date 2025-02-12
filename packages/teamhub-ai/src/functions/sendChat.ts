import { db } from '@teamhub/db'
import type { AgentMemoryRule } from '@teamhub/db'
import type { MemoryStoreRule } from '../types'
import { generateStreamText } from '../ai/vercel/generateStreamText'

export async function sendChat(params: {
  text: string
  agentId: string
  agentCloneId?: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
}) {
  const { text, agentId, agentCloneId, memoryRules, storeRule } = params

  // Get agent for system prompt
  const agent = await db.getAgent(agentId)
  if (!agent) throw new Error('Agent not found')

  const memories = await db.getAgentMemories(agentId, agentCloneId, '', [])

  // Store user input in memory if required
  if (storeRule?.shouldStore) {
    await db.createMemory({
      id: crypto.randomUUID(),
      agentId,
      agentCloneId,
      type: storeRule.messageType,
      category: storeRule.category || 'chat',
      content: text,
      expiresAt: storeRule.retentionDays
        ? new Date(Date.now() + storeRule.retentionDays * 24 * 60 * 60 * 1000)
        : null,
    })
  }

  // Generate streaming response
  const streamResponse = await generateStreamText({
    text,
    agentId,
    systemPrompt: agent.systemPrompt || '',
    memories,
  })

  return new Response(streamResponse, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
