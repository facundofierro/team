/**
 * DeepSeek Embedding Implementation
 *
 * Note: DeepSeek does not currently provide embedding models.
 * This implementation throws an informative error to guide users
 * to use OpenAI for embedding generation instead.
 */

export async function generateDeepSeekEmbedding(
  text: string
): Promise<number[]> {
  throw new Error(
    'DeepSeek does not provide embedding models. Please use OpenAI provider for embedding generation. Set embeddingProvider to "openai" in your configuration.'
  )
}

export async function generateDeepSeekEmbeddings(
  texts: string[]
): Promise<number[][]> {
  throw new Error(
    'DeepSeek does not provide embedding models. Please use OpenAI provider for embedding generation. Set embeddingProvider to "openai" in your configuration.'
  )
}

export async function generateDeepSeekConversationEmbedding(
  messages: Array<{ role: string; content: string }>,
  title?: string,
  summary?: string
): Promise<number[]> {
  throw new Error(
    'DeepSeek does not provide embedding models. Please use OpenAI provider for embedding generation. Set embeddingProvider to "openai" in your configuration.'
  )
}
