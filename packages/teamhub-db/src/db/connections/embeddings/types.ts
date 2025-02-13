import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { embedding } from './schema'

export type Embedding = InferSelectModel<typeof embedding>
export type NewEmbedding = InferInsertModel<typeof embedding>

export type EmbeddingMetadata = {
  [key: string]: unknown
}

export type EmbeddingWithTypes = Embedding & {
  metadata: EmbeddingMetadata
}
