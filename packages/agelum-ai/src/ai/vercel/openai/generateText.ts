import { Message as VercelMessage, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export async function generateOpenAIText(params: {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const {
    prompt,
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1000,
  } = params

  const messages: VercelMessage[] = [
    {
      id: 'user-prompt',
      role: 'user',
      content: prompt,
    },
  ]

  try {
    console.log(
      '🧠 [OpenAI] Generating text for prompt:',
      prompt.substring(0, 100) + '...'
    )

    const result = await generateText({
      model: openaiAI('gpt-4o'),
      system: systemPrompt,
      messages,
      temperature,
      maxTokens,
    })

    console.log('✅ [OpenAI] Text generation completed')
    return result.text
  } catch (error) {
    console.error('❌ [OpenAI] Text generation error:', error)
    throw new Error(`Failed to generate text with OpenAI: ${error}`)
  }
}
