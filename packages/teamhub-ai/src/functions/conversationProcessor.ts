import {
  generateConversationTitle,
  generateConversationBrief,
} from '../ai/vercel/generateText'
import { generateConversationEmbedding } from '../ai/vercel/generateEmbedding'
import { dbMemories, dbEmbeddings } from '@teamhub/db'
import type { ConversationMessage } from '@teamhub/db'

export type ConversationProcessingOptions = {
  orgDatabaseName: string
  aiProvider?: 'deepseek' | 'openai'
  embeddingProvider?: 'openai'
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
    const embeddingFunctions = await dbEmbeddings(options.orgDatabaseName)

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

    // Generate embedding
    const embedding = await generateConversationEmbedding(
      conversationMessages,
      undefined, // We'll use the title from the conversation
      briefData.summary
    )
    console.log(
      '✅ Generated conversation embedding, dimension:',
      embedding.length
    )

    // Update the conversation in the memory database
    await memoryFunctions.updateConversationBrief(
      conversationId,
      briefData.summary,
      briefData.description,
      briefData.keyTopics
    )

    // Store the embedding in the embeddings database
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
