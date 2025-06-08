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

// Specialized function for conversation title generation
export async function generateConversationTitle(
  firstMessage: string,
  provider?: AIProvider
): Promise<string> {
  const systemPrompt = `You are an expert at creating concise, descriptive conversation titles.
Generate a short, clear title (maximum 60 characters) that captures the main topic or intent of the conversation.
The title should be professional, specific, and helpful for finding this conversation later.
Do not use quotes, colons, or special characters. Return only the title text.`

  const prompt = `Generate a conversation title for this message: "${firstMessage}"`

  return generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.3, // Lower temperature for more consistent titles
    maxTokens: 20, // Short titles only
  })
}

// Specialized function for conversation brief generation
export async function generateConversationBrief(
  messages: Array<{ role: string; content: string }>,
  provider?: AIProvider
): Promise<{
  summary: string
  keyTopics: string[]
  description: string
}> {
  const systemPrompt = `You are an expert at analyzing conversations and extracting key information.
Analyze the conversation and provide:
1. A concise summary (2-3 sentences) of what was discussed
2. Key topics/entities mentioned (3-8 important keywords)
3. A description of what information can be found in this conversation

Return your response in JSON format:
{
  "summary": "Brief summary of the conversation",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "description": "Description of what information this conversation contains"
}`

  const conversationText = messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n')

  const prompt = `Analyze this conversation and extract key information:\n\n${conversationText}`

  const result = await generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.4,
    maxTokens: 300,
  })

  try {
    return JSON.parse(result)
  } catch (error) {
    console.error('❌ Failed to parse conversation brief JSON:', error)
    // Fallback if JSON parsing fails
    return {
      summary: 'Conversation analysis completed',
      keyTopics: ['general'],
      description: 'Contains conversation data',
    }
  }
}
