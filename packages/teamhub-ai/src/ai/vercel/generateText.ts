import { Message as VercelMessage, generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

const deepseekAI = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export type AIProvider = 'deepseek' | 'openai'

export async function generateOneShot(params: {
  prompt: string
  systemPrompt?: string
  provider?: AIProvider
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const {
    prompt,
    systemPrompt = '',
    provider = 'deepseek',
    temperature = 0.7,
    maxTokens = 1000,
  } = params

  const models = {
    deepseek: deepseekAI('deepseek-chat'),
    openai: openaiAI('gpt-4'),
  }

  const messages: VercelMessage[] = [
    {
      id: 'user-prompt',
      role: 'user',
      content: prompt,
    },
  ]

  try {
    const result = await generateText({
      model: models[provider],
      system: systemPrompt,
      messages,
      temperature,
      maxTokens,
    })

    return result.text
  } catch (error) {
    console.error(`❌ AI Generation Error (${provider}):`, error)
    throw new Error(`Failed to generate text with ${provider}: ${error}`)
  }
}
