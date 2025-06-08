import { db, dbMemories } from '@teamhub/db'
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
  text: string
  agentId: string
  agentCloneId?: string
  memoryRules?: AgentMemoryRule[]
  storeRule?: MemoryStoreRule
  tools?: AgentToolPermission[]
}) {
  const {
    databaseName,
    text,
    agentId,
    agentCloneId,
    memoryRules,
    storeRule,
    tools = [],
  } = params

  console.log('💬 SendChat: Starting chat processing')
  console.log('💬 SendChat: Database:', databaseName)
  console.log('💬 SendChat: Agent ID:', agentId)
  console.log('💬 SendChat: Agent Clone ID:', agentCloneId)
  console.log('💬 SendChat: Text length:', text.length)
  console.log('💬 SendChat: Tools count:', tools.length)
  console.log(
    '💬 SendChat: Tools:',
    tools.map((tool) => ({
      id: (tool as any).id,
      type: (tool as any).type,
      name: (tool as any).name,
      isManaged: (tool as any).isManaged,
    }))
  )

  try {
    console.log('🔍 SendChat: Fetching agent...')
    // Get agent
    const agent = await db.getAgent(agentId)
    if (!agent) {
      console.error('❌ SendChat: Agent not found:', agentId)
      throw new Error('Agent not found')
    }

    console.log('✅ SendChat: Agent found:', agent.name)

    console.log('🧠 SendChat: Fetching memories...')
    // Get relevant memories using the memories database
    const memoryDb = await dbMemories(databaseName)
    const memories = await memoryDb.getAgentMemories(
      agentId,
      agentCloneId,
      '', // type filter (empty = all types)
      [] // categories filter (empty = all categories)
    )

    console.log('✅ SendChat: Found memories:', memories.length)

    console.log('🤖 SendChat: Generating stream response...')
    // Generate response using AI
    const stream = await generateStreamText({
      text,
      agentId,
      systemPrompt: agent.systemPrompt || '',
      memories,
      tools,
    })

    console.log('✅ SendChat: Stream generated successfully')

    // Store the interaction if storeRule is provided
    if (storeRule) {
      console.log('💾 SendChat: Storing message...')
      try {
        await db.createMessage({
          id: generateUUID(),
          fromAgentId: null, // User message
          toAgentId: agentId,
          toAgentCloneId: agentCloneId || null,
          type: storeRule.messageType,
          content: text,
          metadata: {},
          status: 'completed',
        })
        console.log('✅ SendChat: Message stored successfully')
      } catch (error) {
        console.error('❌ SendChat: Error storing message:', error)
        // Don't fail the entire request if storage fails
      }
    }

    return stream
  } catch (error) {
    console.error('💥 SendChat: Error processing chat:', error)
    console.error(
      '💥 SendChat: Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    )
    throw error
  }
}
