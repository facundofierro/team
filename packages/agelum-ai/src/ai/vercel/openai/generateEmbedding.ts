import { embed, embedMany } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

// Generate embedding for a single text
export async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  try {
    console.log(
      '🧠 [OpenAI] Generating embedding for text:',
      text.substring(0, 100) + '...'
    )

    const { embedding } = await embed({
      model: openaiAI.embedding('text-embedding-3-small'),
      value: text,
    })

    console.log('✅ [OpenAI] Embedding generation completed')
    return embedding
  } catch (error) {
    console.error('❌ [OpenAI] Embedding generation error:', error)
    throw new Error(`Failed to generate embedding with OpenAI: ${error}`)
  }
}

// Generate embeddings for multiple texts
export async function generateOpenAIEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    console.log('🧠 [OpenAI] Generating embeddings for', texts.length, 'texts')

    const { embeddings } = await embedMany({
      model: openaiAI.embedding('text-embedding-3-small'),
      values: texts,
    })

    console.log('✅ [OpenAI] Embeddings generation completed')
    return embeddings
  } catch (error) {
    console.error('❌ [OpenAI] Embeddings generation error:', error)
    throw new Error(`Failed to generate embeddings with OpenAI: ${error}`)
  }
}

// Generate embedding specifically for conversation content
export async function generateOpenAIConversationEmbedding(
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

  return generateOpenAIEmbedding(conversationText)
}
