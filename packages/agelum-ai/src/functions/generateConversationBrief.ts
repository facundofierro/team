import { generateOneShot, AIProvider } from '../ai/vercel/generateText'
import { generateConversationEmbedding } from '../ai/vercel/generateEmbedding'
import { dbMemories, dbEmbeddings } from '@agelum/db'
import type { ConversationMessage } from '@agelum/db'

export type ConversationProcessingOptions = {
  orgDatabaseName: string
  aiProvider?: 'deepseek' | 'openai'
  embeddingProvider?: 'openai'
  skipEmbeddings?: boolean
}

export type ProcessedConversationData = {
  title: string
  summary?: string
  description?: string
  keyTopics?: string[]
  embedding?: number[]
}

/**
 * Generate an AI-powered title for a conversation based on the first message
 */
export async function processConversationTitle(
  firstMessage: string,
  options: ConversationProcessingOptions
): Promise<string> {
  try {
    console.log(
      '🎯 Processing conversation title for:',
      firstMessage.substring(0, 50) + '...'
    )

    const title = await generateConversationTitle(
      firstMessage,
      options.aiProvider
    )

    console.log('✅ Generated conversation title:', title)
    return title
  } catch (error) {
    console.error('❌ Failed to generate conversation title:', error)
    // Fallback to truncated first message
    return firstMessage.length > 60
      ? firstMessage.substring(0, 57) + '...'
      : firstMessage
  }
}

/**
 * Process a completed conversation to generate summary, topics, and embedding
 */
export async function processConversationBrief(
  conversationId: string,
  messages: ConversationMessage[],
  options: ConversationProcessingOptions
): Promise<ProcessedConversationData> {
  try {
    console.log('📋 Processing conversation brief for:', conversationId)
    console.log('📋 Message count:', messages.length)

    // Initialize database connections
    const memoryFunctions = await dbMemories(options.orgDatabaseName)

    // Generate AI brief
    const conversationMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const briefData = await generateConversationBrief(
      conversationMessages,
      options.aiProvider
    )
    console.log('✅ Generated conversation brief:', briefData)

    // Try to generate embedding (optional - gracefully handle failures)
    let embedding: number[] | undefined

    if (options.skipEmbeddings) {
      console.log(
        'ℹ️ Skipping embedding generation - disabled in configuration'
      )
      embedding = undefined
    } else {
      try {
        embedding = await generateConversationEmbedding(
          conversationMessages,
          undefined, // We'll use the title from the conversation
          briefData.summary
        )
        console.log(
          '✅ Generated conversation embedding, dimension:',
          embedding.length
        )
      } catch (error: any) {
        if (error.message === 'EMBEDDING_REGION_NOT_SUPPORTED') {
          console.warn(
            '⚠️ Skipping embedding generation - not available in this region'
          )
          embedding = undefined
        } else {
          console.error('❌ Failed to generate embedding:', error)
          embedding = undefined
        }
      }
    }

    // Update the conversation in the memory database
    await memoryFunctions.updateConversationBrief(
      conversationId,
      briefData.summary,
      briefData.description,
      briefData.keyTopics
    )

    // Store the embedding only if it was successfully generated
    if (embedding && embedding.length > 0) {
      try {
        const embeddingFunctions = await dbEmbeddings(options.orgDatabaseName)
        await embeddingFunctions.createEmbedding({
          id: `conv_emb_${conversationId}`,
          type: 'conversation',
          referenceId: conversationId,
          vector: embedding,
          version: '1.0',
          model: 'text-embedding-3-small',
          dimension: embedding.length,
          metadata: {
            messageCount: messages.length,
            keyTopics: briefData.keyTopics,
            processedAt: new Date().toISOString(),
          },
        })
        console.log('✅ Stored conversation embedding successfully')
      } catch (embError) {
        console.warn('⚠️ Failed to store embedding, but continuing:', embError)
      }
    } else {
      console.log('ℹ️ No embedding to store - continuing without embedding')
    }

    console.log('✅ Conversation processing completed for:', conversationId)

    return {
      title: '', // Title is handled separately
      summary: briefData.summary,
      description: briefData.description,
      keyTopics: briefData.keyTopics,
      embedding,
    }
  } catch (error) {
    console.error('❌ Failed to process conversation brief:', error)
    throw error
  }
}

/**
 * Enhanced conversation title generation with database integration
 */
export async function enhanceConversationTitle(
  conversationId: string,
  currentTitle: string,
  messages: ConversationMessage[],
  options: ConversationProcessingOptions
): Promise<string> {
  try {
    console.log('🔄 Enhancing conversation title for:', conversationId)

    // If we have enough messages for context, regenerate the title
    if (messages.length >= 3) {
      const conversationContext = messages
        .slice(0, 5) // Use first 5 messages for context
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n')

      const enhancedTitle = await generateConversationTitle(
        conversationContext,
        options.aiProvider
      )

      // Update the title in the database
      const memoryFunctions = await dbMemories(options.orgDatabaseName)
      await memoryFunctions.updateMemory(conversationId, {
        title: enhancedTitle,
      })

      console.log('✅ Enhanced conversation title:', enhancedTitle)
      return enhancedTitle
    }

    return currentTitle
  } catch (error) {
    console.error('❌ Failed to enhance conversation title:', error)
    return currentTitle // Return original title on error
  }
}

/**
 * Background processor for conversations that need briefs
 */
export async function processConversationsNeedingBriefs(
  agentId: string,
  options: ConversationProcessingOptions
): Promise<void> {
  try {
    console.log(
      '🔄 Processing conversations needing briefs for agent:',
      agentId
    )

    const memoryFunctions = await dbMemories(options.orgDatabaseName)
    const conversationsNeedingBrief =
      await memoryFunctions.getConversationsNeedingBrief(agentId, 5)

    console.log(
      '📋 Found conversations needing brief:',
      conversationsNeedingBrief.length
    )

    for (const conversation of conversationsNeedingBrief) {
      try {
        await processConversationBrief(
          conversation.id,
          conversation.content as ConversationMessage[],
          options
        )

        console.log('✅ Processed brief for conversation:', conversation.id)
      } catch (error) {
        console.error(
          '❌ Failed to process brief for conversation:',
          conversation.id,
          error
        )
        // Continue with other conversations even if one fails
      }
    }

    console.log('✅ Completed processing conversations needing briefs')
  } catch (error) {
    console.error('❌ Failed to process conversations needing briefs:', error)
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
  return result.replace(/^['"]|['"]$/g, '').trim()
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
Escape all quotes in the summary field with backslashes.
Return exactly this format:
{"description": "What information this conversation contains", "summary": "# Markdown formatted content\\n\\n**Key points:**\\n- Point 1\\n- Point 2", "keyTopics": ["topic1", "topic2", "topic3"]}`

  const conversationText = messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n')

  const prompt = `Analyze this conversation and extract key information:\n\n${conversationText}`

  const result = await generateOneShot({
    prompt,
    systemPrompt,
    provider,
    temperature: 0.4,
    maxTokens: 1200, // Increased to capture more content and reduce truncation
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

    // Minimal safe cleanup: remove control characters (except \n, \r, \t) and trailing commas
    cleanResult = cleanResult
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')

    console.log('🔧 Cleaned JSON:', cleanResult.substring(0, 200) + '...')

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
      // Try to extract content using more flexible patterns
      const summaryMatch = result.match(/"summary":\s*"((?:[^"\\]|\\.)*)"/s)
      const descriptionMatch = result.match(
        /"description":\s*"((?:[^"\\]|\\.)*)"/s
      )
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
            ? descriptionMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
            : 'Contains conversation data',
        }
      }

      // Try alternative approach - look for any content between quotes
      const contentBlocks = result.match(/"([^"]*(?:\\"[^"]*)*)"/g)
      if (contentBlocks && contentBlocks.length >= 2) {
        const cleanBlocks = contentBlocks.map((block) =>
          block.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n')
        )

        return {
          summary: cleanBlocks[1] || 'Conversation analysis completed',
          keyTopics: ['general'],
          description: cleanBlocks[0] || 'Contains conversation data',
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
  return result.replace(/^['"]|['"]$/g, '').trim()
}
