import { Message as VercelMessage, generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekApiKey = process.env.DEEPSEEK_API_KEY

if (!deepseekApiKey) {
  console.error(
    '❌ Missing DEEPSEEK_API_KEY environment variable. The application will not be able to connect to the AI service.'
  )
}

const deepseekAI = createDeepSeek({
  apiKey: deepseekApiKey ?? '',
})

export async function generateDeepSeekText(params: {
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
      '🧠 [DeepSeek] Generating text for prompt:',
      prompt.substring(0, 100) + '...'
    )

    const result = await generateText({
      model: deepseekAI('deepseek-chat'),
      system: systemPrompt,
      messages,
      temperature,
      maxTokens,
    })

    console.log('✅ [DeepSeek] Text generation completed')
    return result.text
  } catch (error) {
    console.error('❌ [DeepSeek] Text generation error:', error)
    throw new Error(`Failed to generate text with DeepSeek: ${error}`)
  }
}
