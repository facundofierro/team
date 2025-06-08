import { Message as VercelMessage, streamText, tool } from 'ai'
import { MemoryWithTypes, Memory, AgentToolPermission } from '@teamhub/db'
import { generateDeepseekStream } from './deepseek/generateStreamText'
import { generateOpenAIStream } from './openai/generateStreamText'
import { getAISDKTool } from '../../tools'

export type AIProvider = 'deepseek' | 'openai'

export async function generateStreamText(params: {
  text: string
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
    text,
    tools = [],
  } = params

  console.log('🤖 GenerateStreamText: Starting text generation')
  console.log('🤖 GenerateStreamText: Provider:', provider)
  console.log('🤖 GenerateStreamText: Agent ID:', params.agentId)
  console.log('🤖 GenerateStreamText: Text length:', text.length)
  console.log('🤖 GenerateStreamText: Memories count:', memories.length)
  console.log('🤖 GenerateStreamText: Tools count:', tools.length)

  // Validate text parameter
  if (!text || typeof text !== 'string') {
    console.error('❌ GenerateStreamText: Invalid text parameter')
    throw new Error('Text parameter is required and must be a string')
  }

  const generators = {
    deepseek: generateDeepseekStream,
    openai: generateOpenAIStream,
  }

  // Filter memories with valid content and convert to messages
  const memoryMessages: VercelMessage[] = memories
    .filter(
      (memory: Memory) => memory.content && memory.content.trim().length > 0
    )
    .map((memory: Memory) => ({
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: memory.content!,
    }))

  console.log(
    '💭 GenerateStreamText: Memory messages count:',
    memoryMessages.length
  )

  const messages: VercelMessage[] = [
    ...memoryMessages,
    {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: text.trim() || 'Hello', // Ensure we always have content
    },
  ]

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

  return generators[provider]({
    systemPrompt,
    messages,
    tools: aiTools,
  })
}
