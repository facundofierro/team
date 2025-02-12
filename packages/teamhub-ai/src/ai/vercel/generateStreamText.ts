import { Message as VercelMessage } from 'ai'
import { Memory } from '@teamhub/db'
import { generateDeepseekStream } from './deepseek/generateStreamText'
import { generateOpenAIStream } from './openai/generateStreamText'

export type AIProvider = 'deepseek' | 'openai'

export async function generateStreamText(params: {
  text: string
  agentId: string
  systemPrompt?: string
  memories: Memory[]
  provider?: AIProvider
}) {
  const { provider = 'deepseek', systemPrompt = '', memories, text } = params

  const generators = {
    deepseek: generateDeepseekStream,
    openai: generateOpenAIStream,
  }

  const memoryMessages: VercelMessage[] = memories.map((memory: Memory) => ({
    id: crypto.randomUUID(),
    role: 'user',
    content: memory.content ?? '',
    temperature: 0.7,
  }))

  const messages: VercelMessage[] = [
    ...memoryMessages,
    { id: crypto.randomUUID(), role: 'user', content: text },
  ]

  return generators[provider]({
    systemPrompt,
    messages,
  })
}
