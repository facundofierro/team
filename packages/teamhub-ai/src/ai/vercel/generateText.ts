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
  const systemPrompt = `You are an expert at creating concise, descriptive memory titles.
Generate a short, clear title (maximum 50 characters) that captures the main topic or deliverable of the conversation.
Focus on the core subject, removing unnecessary words like "Requirements for", "Search for", "Discussion about", "Meeting about", "Chat about".
The title should be direct, specific, and helpful for finding this memory later.
Do not use quotes, colons, special characters, or conversation-related words.
Return only the simplified title text.

Examples:
- "Requirements for Russian BHX documentation" → "Russian BHX Documentation"
- "Search for logistic companies in Saint Petersburg" → "Saint Petersburg Logistics Companies"
- "Discussion about API integration best practices" → "API Integration Best Practices"`

  const prompt = `Generate a concise memory title for this conversation starter: "${firstMessage}"`

  const result = await generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.3, // Lower temperature for more consistent titles
    maxTokens: 15, // Very short titles only
  })

  // Clean the result by removing quotes and extra whitespace
  return result.replace(/^["']|["']$/g, '').trim()
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
  const systemPrompt = `You are an expert at analyzing conversations and extracting valuable information for future reference.

Generate 3 specific outputs:

1. **description** (Overview): A 1-2 sentence description of what information/content this conversation contains. This helps users understand what they can find here when searching. Focus on WHAT is included, not what happened.

2. **summary** (Valuable Content): Extract and organize all valuable, actionable information from this conversation. Remove conversation flow, dialog format, and process details. Focus on actual results, data, lists, links, and useful content that would be valuable for future reference. Present information directly as if it's a reference document. Use clear markdown structure with formatting when appropriate (headers, lists, bold text, etc.).

3. **keyTopics**: 3-8 important keywords/topics/entities mentioned.

Rules for summary:
- Include: Final results, deliverables, lists, data, links, specific information, key facts, actionable insights
- Exclude: "The user asked...", "The assistant replied...", conversation flow, process descriptions, intermediate steps, thank you messages
- Format: MARKDOWN TEXT with proper formatting (# headers, **bold**, - lists, etc.) - NOT JSON or escaped text
- Length: As long or short as needed to capture all valuable content

IMPORTANT: Return ONLY valid JSON. No markdown code blocks or explanations.
The summary field must contain plain markdown text (not escaped or nested JSON).
Return exactly this format:
{"description": "What information this conversation contains", "summary": "# Markdown formatted content\n\n**Key points:**\n- Point 1\n- Point 2", "keyTopics": ["topic1", "topic2", "topic3"]}`

  const conversationText = messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n')

  const prompt = `Analyze this conversation and extract key information:\n\n${conversationText}`

  const result = await generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.4,
    maxTokens: 800, // Increased to capture more valuable content
  })

  // Debug logging to see what the AI is returning
  console.log(
    '🔍 AI Raw Response for conversation brief:',
    result.substring(0, 200) + '...'
  )

  try {
    // Clean the result by removing any markdown code blocks or extra formatting
    let cleanResult = result.trim()

    // Remove markdown code blocks if present
    if (cleanResult.startsWith('```json')) {
      cleanResult = cleanResult.replace(/^```json\s*/, '')
    }
    if (cleanResult.startsWith('```')) {
      cleanResult = cleanResult.replace(/^```\s*/, '')
    }
    if (cleanResult.endsWith('```')) {
      cleanResult = cleanResult.replace(/\s*```$/, '')
    }

    // Try to find JSON object if there's extra text
    const jsonMatch = cleanResult.match(/\{.*\}/s)
    if (jsonMatch) {
      cleanResult = jsonMatch[0]
    }

    // Parse the JSON
    const parsed = JSON.parse(cleanResult)

    // Validate that we have the expected structure
    if (
      !parsed.summary ||
      !parsed.description ||
      !Array.isArray(parsed.keyTopics)
    ) {
      throw new Error('Invalid JSON structure returned by AI')
    }

    // Ensure summary is a string and not nested JSON
    if (typeof parsed.summary !== 'string') {
      console.warn(
        '⚠️ Summary is not a string, converting:',
        typeof parsed.summary
      )
      parsed.summary = String(parsed.summary)
    }

    // Clean up any escaped content in the summary
    parsed.summary = parsed.summary
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')

    return parsed
  } catch (error) {
    console.error('❌ Failed to parse conversation brief JSON:', error)
    console.error('❌ Raw AI response:', result)

    // More robust fallback - try to extract content even if JSON parsing fails
    try {
      // Try to extract at least the summary content if it's visible
      const summaryMatch = result.match(/"summary":\s*"([^"]+)"/s)
      const descriptionMatch = result.match(/"description":\s*"([^"]+)"/s)
      const topicsMatch = result.match(/"keyTopics":\s*\[(.*?)\]/s)

      if (summaryMatch || descriptionMatch) {
        return {
          summary: summaryMatch
            ? summaryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
            : 'Conversation analysis completed',
          keyTopics: topicsMatch
            ? topicsMatch[1].split(',').map((t) => t.trim().replace(/"/g, ''))
            : ['general'],
          description: descriptionMatch
            ? descriptionMatch[1]
            : 'Contains conversation data',
        }
      }
    } catch (fallbackError) {
      console.error('❌ Fallback parsing also failed:', fallbackError)
    }

    // Final fallback if all parsing fails
    return {
      summary: 'Conversation analysis completed',
      keyTopics: ['general'],
      description: 'Contains conversation data',
    }
  }
}

// Specialized function for generating description from summary
export async function generateDescriptionFromSummary(
  summary: string,
  provider?: AIProvider
): Promise<string> {
  const systemPrompt = `You are an expert at creating concise descriptions from detailed content.
Generate a 1-2 sentence description that explains what information can be found in the provided summary.
This description will help users understand what they can find when searching through memories.
Focus on WHAT content is included, not what process happened.
Be specific about the type of information, data, or results contained.
Do not use quotes or special characters. Return only the description text.

Examples:
- Summary about company list → "Contains contact details and services for 10 logistic companies in Saint Petersburg specializing in Argentina imports"
- Summary about API documentation → "Includes technical specifications and implementation examples for REST API endpoints"
- Summary about project requirements → "Provides detailed feature specifications and technical requirements for web application development"`

  const prompt = `Generate a description for this summary content: "${summary}"`

  return generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.3,
    maxTokens: 50, // Keep descriptions concise
  })
}

// Specialized function for generating title from description
export async function generateTitleFromDescription(
  description: string,
  provider?: AIProvider
): Promise<string> {
  const systemPrompt = `You are an expert at creating ultra-concise titles from descriptions.
Generate a very short title (maximum 40 characters) that captures the core subject of the description.
Remove all unnecessary words, articles, and descriptive language.
Focus on the main topic or deliverable.
Do not use quotes, colons, special characters, or descriptive phrases.
Return only the essential subject matter.

Examples:
- "Contains contact details for logistic companies..." → "Saint Petersburg Logistics Companies"
- "Includes API specifications and examples..." → "REST API Documentation"
- "Provides project requirements for web app..." → "Web App Requirements"`

  const prompt = `Generate a concise title for this description: "${description}"`

  const result = await generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.3,
    maxTokens: 10, // Very short titles
  })

  // Clean the result by removing quotes and extra whitespace
  return result.replace(/^["']|["']$/g, '').trim()
}
