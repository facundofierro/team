import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { memory } from './schema'

export type Memory = InferSelectModel<typeof memory>
export type NewMemory = InferInsertModel<typeof memory>

export type MemoryMetadata = {
  [key: string]: unknown
}

export type MemoryWithTypes = Memory & {
  structuredData: MemoryMetadata
}
