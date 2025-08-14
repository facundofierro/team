import { db, dbMemories, createMessage, reactiveDb } from '@teamhub/db'
import type { AgentMemoryRule, AgentToolPermission } from '@teamhub/db'
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
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  summary?: string
  agentId: string
  agentCloneId?: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
  tools?: AgentToolPermission[]
}) {
  const {
    databaseName,
    messages,
    summary,
    agentId,
    agentCloneId,
    memoryRules,
    storeRule,
    tools = [],
  } = params

  try {
    const agent = await getAgent.execute({ id: agentId }, reactiveDb)
    if (!agent) {
      throw new Error('Agent not found')
    }

    const memoryDb = await dbMemories(databaseName)
    const memories = await memoryDb.getAgentMemories(agentId, {
      agentCloneId,
    })

    console.log('🎬 SendChat: Calling generateStreamText (without await)...')

    const streamPromise = generateStreamText({
      messages,
      summary,
      agentId,
      systemPrompt: agent.systemPrompt || '',
      memories,
      tools,
    })

    // Background task: store message after stream starts
    if (storeRule) {
      const latestUserMessage =
        messages.filter((m) => m.role === 'user').pop()?.content || ''

      // Run this in background without blocking the stream
      setImmediate(async () => {
        try {
          // For now, we'll need to handle the messageTypeId mapping
          // The old schema used 'type' field, new schema uses 'messageTypeId'
          // We'll need to either create a message type or use a default one
          const messageTypeId = storeRule.messageType // This might need to be a UUID

          await createMessage.execute(
            {
              fromAgentId: null,
              toAgentId: agentId,
              content: latestUserMessage,
              messageTypeId: messageTypeId,
              organizationId: agent.organizationId || '', // We need organizationId
              metadata: {},
            },
            reactiveDb
          )
        } catch (error) {
          console.error('❌ SendChat: background message store failed:', error)
        }
      })
    }

    console.log('🎬 SendChat: Returning stream promise...')
    return streamPromise
  } catch (error) {
    console.error('💥 SendChat: Error processing chat:', error)
    return new Response('An error occurred during stream generation.', {
      status: 500,
    })
  }
}
