'use server'

import {
  dbMemories,
  type ConversationMemory,
  type ConversationMessage,
  type ToolCall,
} from '@teamhub/db'
import {
  processConversationTitle,
  processConversationBrief,
  enhanceConversationTitle,
  type ConversationProcessingOptions,
} from '@teamhub/ai'
import { auth } from '@/auth'

/**
 * Get the active conversation for an agent
 */
export async function getActiveConversation(
  agentId: string,
  orgDatabaseName: string
): Promise<ConversationMemory | null> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)
    return await memoryFunctions.getActiveConversation(agentId)
  } catch (error) {
    console.error('Failed to get active conversation:', error)
    return null
  }
}

/**
 * Get recent conversations for an agent
 */
export async function getRecentConversations(
  agentId: string,
  orgDatabaseName: string,
  limit: number = 10
): Promise<ConversationMemory[]> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)
    return await memoryFunctions.getConversations(agentId, undefined, limit)
  } catch (error) {
    console.error('Failed to get recent conversations:', error)
    return []
  }
}

/**
 * Start a new conversation with AI-powered title generation
 */
export async function startNewConversation(
  agentId: string,
  firstMessage: string,
  orgDatabaseName: string
): Promise<ConversationMemory> {
  try {
    // Get user ID from auth context
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const memoryFunctions = await dbMemories(orgDatabaseName)

    // Generate AI-powered title in the background
    const processingOptions: ConversationProcessingOptions = {
      orgDatabaseName,
      aiProvider: 'deepseek',
    }

    let conversationTitle =
      firstMessage.length > 60
        ? firstMessage.substring(0, 57) + '...'
        : firstMessage

    // Create conversation with initial title
    const newConversation = await memoryFunctions.startNewConversation(
      agentId,
      null, // agentCloneId - for future use with instances
      session.user.id,
      conversationTitle
    )

    // Generate AI title in background and update
    const processingOptionsWithEmbeddings: ConversationProcessingOptions = {
      ...processingOptions,
      skipEmbeddings: true, // Disable embeddings for regions where OpenAI is not available
    }

    processConversationTitle(firstMessage, processingOptionsWithEmbeddings)
      .then(async (aiTitle) => {
        if (aiTitle && aiTitle !== conversationTitle) {
          await memoryFunctions.updateMemory(newConversation.id, {
            title: aiTitle,
          })
          console.log('✅ Updated conversation title to:', aiTitle)
        }
      })
      .catch((error) => {
        console.error('❌ Failed to generate AI title:', error)
      })

    return newConversation
  } catch (error) {
    console.error('Failed to start new conversation:', error)
    throw error
  }
}

/**
 * Add a message to an existing conversation
 */
export async function addMessageToConversation(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  orgDatabaseName: string,
  messageId?: string,
  toolCalls?: ToolCall[]
): Promise<ConversationMemory | null> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)
    return await memoryFunctions.addMessageToConversation(
      conversationId,
      role,
      content,
      messageId,
      toolCalls
    )
  } catch (error) {
    console.error('Failed to add message to conversation:', error)
    return null
  }
}

/**
 * Complete a conversation and trigger AI brief generation
 */
export async function completeConversation(
  conversationId: string,
  orgDatabaseName: string
): Promise<void> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)

    // Get conversation details before completing
    const conversation = await memoryFunctions.getMemory(conversationId)
    if (!conversation || conversation.type !== 'conversation') {
      throw new Error('Conversation not found')
    }

    // Mark conversation as complete
    await memoryFunctions.completeConversation(conversationId)

    // Trigger AI brief generation in background if conversation has messages
    if (
      conversation.content &&
      Array.isArray(conversation.content) &&
      conversation.content.length > 1
    ) {
      const processingOptions: ConversationProcessingOptions = {
        orgDatabaseName,
        aiProvider: 'deepseek',
        skipEmbeddings: true, // Disable embeddings for regions where OpenAI is not available
      }

      processConversationBrief(
        conversationId,
        conversation.content as ConversationMessage[],
        processingOptions
      )
        .then(() => {
          console.log('✅ Generated conversation brief for:', conversationId)
        })
        .catch((error) => {
          console.error('❌ Failed to generate conversation brief:', error)
        })
    }
  } catch (error) {
    console.error('Failed to complete conversation:', error)
    throw error
  }
}

/**
 * Load conversation history by ID
 */
export async function loadConversationHistory(
  conversationId: string,
  orgDatabaseName: string
): Promise<ConversationMemory | null> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)
    const conversation = await memoryFunctions.getMemory(conversationId)

    if (conversation && conversation.type === 'conversation') {
      return conversation as ConversationMemory
    }

    return null
  } catch (error) {
    console.error('Failed to load conversation history:', error)
    return null
  }
}

/**
 * Switch to a different conversation
 */
export async function switchToConversation(
  conversationId: string,
  orgDatabaseName: string
): Promise<ConversationMemory | null> {
  try {
    const memoryFunctions = await dbMemories(orgDatabaseName)
    const conversation = await memoryFunctions.getMemory(conversationId)

    if (conversation && conversation.type === 'conversation') {
      // TODO: Mark this conversation as active in the database
      // For now, just return the conversation
      return conversation as ConversationMemory
    }

    return null
  } catch (error) {
    console.error('Failed to switch to conversation:', error)
    return null
  }
}
