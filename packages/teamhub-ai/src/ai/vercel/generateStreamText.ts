import { Message as VercelMessage, streamText } from 'ai'
import { MemoryWithTypes, Memory } from '@teamhub/db'
import { generateDeepseekStream } from './deepseek/generateStreamText'
import { generateOpenAIStream } from './openai/generateStreamText'

export type AIProvider = 'deepseek' | 'openai'

export async function generateStreamText(params: {
  text: string
  agentId: string
  systemPrompt?: string
  memories: MemoryWithTypes[]
  provider?: AIProvider
}) {
  const { provider = 'deepseek', systemPrompt = '', memories, text } = params

  // Validate text parameter
  if (!text || typeof text !== 'string') {
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

  const messages: VercelMessage[] = [
    ...memoryMessages,
    {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: text.trim() || 'Hello', // Ensure we always have content
    },
  ]

  return generators[provider]({
    systemPrompt,
    messages,
  })
}
