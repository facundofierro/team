import { Message as VercelMessage, streamText, tool } from 'ai'
import { MemoryWithTypes, Memory, AgentToolPermission } from '@teamhub/db'
import { generateDeepseekStream } from './deepseek/generateStreamText'
import { generateOpenAIStream } from './openai/generateStreamText'
import { getAISDKTool } from '../../tools'

export type AIProvider = 'deepseek' | 'openai'

export async function generateStreamText(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  agentId: string
  systemPrompt?: string
  memories: MemoryWithTypes[]
  provider?: AIProvider
  tools?: AgentToolPermission[]
}) {
  const {
    provider = 'deepseek',
    systemPrompt = '',
    memories,
    messages: inputMessages,
    tools = [],
  } = params

  console.log('🤖 GenerateStreamText: Starting text generation')
  console.log('🤖 GenerateStreamText: Provider:', provider)
  console.log('🤖 GenerateStreamText: Agent ID:', params.agentId)
  console.log(
    '🤖 GenerateStreamText: Input messages count:',
    inputMessages.length
  )
  console.log('🤖 GenerateStreamText: Memories count:', memories.length)
  console.log('🤖 GenerateStreamText: Tools count:', tools.length)

  // Validate messages parameter
  if (
    !inputMessages ||
    !Array.isArray(inputMessages) ||
    inputMessages.length === 0
  ) {
    console.error('❌ GenerateStreamText: Invalid messages parameter')
    throw new Error(
      'Messages parameter is required and must be a non-empty array'
    )
  }

  const generators = {
    deepseek: generateDeepseekStream,
    openai: generateOpenAIStream,
  }

  console.log(
    `🎯 GenerateStreamText: Selected AI Provider: ${provider.toUpperCase()}`
  )
  console.log(
    `🎯 GenerateStreamText: Available providers:`,
    Object.keys(generators)
  )
  console.log(
    `🎯 GenerateStreamText: Generator function:`,
    generators[provider]?.name || 'unknown'
  )

  const memoryMessages: VercelMessage[] = memories.reduce(
    (acc: VercelMessage[], memory: Memory) => {
      if (!memory.content) {
        return acc
      }
      // memory.content is JSONB, so it can be an object, array, or primitive.
      // We need to convert it to a meaningful string.
      let contentString: string
      if (typeof memory.content === 'string') {
        contentString = memory.content
      } else {
        contentString = JSON.stringify(memory.content)
      }

      // Filter out empty/useless content
      if (
        contentString.trim().length === 0 ||
        contentString === '{}' ||
        contentString === '[]'
      ) {
        return acc
      }

      acc.push({
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: `Recalled memory titled '${memory.title}': ${contentString}`,
      })
      return acc
    },
    []
  )

  console.log(
    '💭 GenerateStreamText: Memory messages count:',
    memoryMessages.length
  )

  // Convert input messages to Vercel format and combine with memory messages
  const conversationMessages: VercelMessage[] = inputMessages.map((msg) => ({
    id: crypto.randomUUID(),
    role: msg.role,
    content: msg.content.trim() || 'Hello', // Ensure we always have content
  }))

  const messages: VercelMessage[] = [...memoryMessages, ...conversationMessages]

  console.log('📨 GenerateStreamText: Total messages count:', messages.length)

  // Convert agent tools to AI SDK tools format
  const aiTools: Record<string, any> = {}

  if (tools.length > 0) {
    console.log('🔧 GenerateStreamText: Converting tools to AI SDK format...')

    for (const agentTool of tools) {
      try {
        console.log(`🔧 GenerateStreamText: Converting tool:`, {
          id: (agentTool as any).id,
          type: (agentTool as any).type,
          name: (agentTool as any).name,
        })

        const aiTool = await getAISDKTool(agentTool)
        if (aiTool) {
          const toolKey = (agentTool as any).id || (agentTool as any).type
          aiTools[toolKey] = aiTool
          console.log(
            `✅ GenerateStreamText: Successfully converted tool: ${toolKey}`
          )
        } else {
          console.warn(
            `⚠️ GenerateStreamText: Tool conversion returned null for: ${
              (agentTool as any).id
            }`
          )
        }
      } catch (error) {
        console.error(
          `❌ GenerateStreamText: Failed to convert tool ${
            (agentTool as any).id
          }:`,
          error
        )
      }
    }

    console.log('🔧 GenerateStreamText: Converted tools:', Object.keys(aiTools))
  } else {
    console.log('🔧 GenerateStreamText: No tools to convert')
  }

  console.log(
    '🎛️ GenerateStreamText: Calling generator with tools:',
    Object.keys(aiTools).length
  )

  console.log('📦 GenerateStreamText: Final payload to be sent to AI:', {
    systemPrompt: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      toolInvocations: (m as any).toolInvocations,
    })),
    tools: Object.keys(aiTools),
  })

  console.log(
    `🚀 GenerateStreamText: Calling ${provider.toUpperCase()} generator...`
  )
  console.log(
    `🚀 GenerateStreamText: Function to call: ${generators[provider]?.name}`
  )

  const result = generators[provider]({
    systemPrompt,
    messages,
    tools: aiTools,
  })

  console.log(
    `✅ GenerateStreamText: ${provider.toUpperCase()} generator called successfully`
  )
  return result
}
