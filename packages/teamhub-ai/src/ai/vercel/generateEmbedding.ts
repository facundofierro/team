import { createOpenAI } from '@ai-sdk/openai'
import { embedMany, embed } from 'ai'

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export type EmbeddingProvider = 'openai'

// Generate embedding for a single text
export async function generateEmbedding(
  text: string,
  provider: EmbeddingProvider = 'openai'
): Promise<number[]> {
  const models = {
    openai: openaiAI.embedding('text-embedding-3-small'),
  }

  try {
    const { embedding } = await embed({
      model: models[provider],
      value: text,
    })

    return embedding
  } catch (error: any) {
    console.error(`❌ Embedding Generation Error (${provider}):`, error)

    // Check for region restrictions
    if (
      error.statusCode === 403 &&
      (error.responseBody?.includes('unsupported_country_region_territory') ||
        error.message?.includes('Country, region, or territory not supported'))
    ) {
      console.warn(
        '⚠️ OpenAI embeddings not available in this region. Disabling embedding generation.'
      )
      throw new Error('EMBEDDING_REGION_NOT_SUPPORTED')
    }

    throw new Error(`Failed to generate embedding with ${provider}: ${error}`)
  }
}

// Generate embeddings for multiple texts
export async function generateEmbeddings(
  texts: string[],
  provider: EmbeddingProvider = 'openai'
): Promise<number[][]> {
  const models = {
    openai: openaiAI.embedding('text-embedding-3-small'),
  }

  try {
    const { embeddings } = await embedMany({
      model: models[provider],
      values: texts,
    })

    return embeddings
  } catch (error: any) {
    console.error(`❌ Embeddings Generation Error (${provider}):`, error)

    // Check for region restrictions
    if (
      error.statusCode === 403 &&
      (error.responseBody?.includes('unsupported_country_region_territory') ||
        error.message?.includes('Country, region, or territory not supported'))
    ) {
      console.warn(
        '⚠️ OpenAI embeddings not available in this region. Disabling embedding generation.'
      )
      throw new Error('EMBEDDING_REGION_NOT_SUPPORTED')
    }

    throw new Error(`Failed to generate embeddings with ${provider}: ${error}`)
  }
}

// Generate embedding specifically for conversation content
export async function generateConversationEmbedding(
  messages: Array<{ role: string; content: string }>,
  title?: string,
  summary?: string
): Promise<number[]> {
  // Create a comprehensive text representation of the conversation
  const conversationText = [
    title && `Title: ${title}`,
    summary && `Summary: ${summary}`,
    messages.map((msg) => `${msg.role}: ${msg.content}`).join(' '),
  ]
    .filter(Boolean)
    .join(' ')

  return generateEmbedding(conversationText)
}
