import { db, dbMemories } from '@teamhub/db'
import type { AgentMemoryRule } from '@teamhub/db'
import type { MemoryStoreRule } from '../types'
import { generateStreamText } from '../ai/vercel/generateStreamText'

// Helper function to generate UUID using Web Crypto API
const generateUUID = () => {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: number) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  )
}

export async function sendChat(params: {
  databaseName: string
  text: string
  agentId: string
  agentCloneId?: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
}) {
  const { databaseName, text, agentId, agentCloneId, memoryRules, storeRule } =
    params

  // Get agent for system prompt
  const agent = await db.getAgent(agentId)
  if (!agent) throw new Error('Agent not found')

  const memoryDb = await dbMemories(databaseName)
  const memories = await memoryDb.getAgentMemories(
    agentId,
    agentCloneId,
    '',
    []
  )

  // Store user input in memory if required
  if (storeRule?.shouldStore) {
    await memoryDb.createMemory({
      id: generateUUID(),
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

  return streamResponse
}
