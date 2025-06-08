import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { memory } from './schema'

// Base memory types
export type Memory = InferSelectModel<typeof memory>
export type NewMemory = InferInsertModel<typeof memory>

// Content structure for different memory types
export type ConversationMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export type FactContent = {
  fact: string
  context?: string
  confidence?: number
  source?: string
}

export type PreferenceContent = {
  preference: string
  value: string | number | boolean
  context?: string
}

export type SkillContent = {
  skill: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  description?: string
  examples?: string[]
}

// Memory content can be any of these types
export type MemoryContent =
  | ConversationMessage[]
  | FactContent
  | PreferenceContent
  | SkillContent
  | Record<string, unknown>

// Typed memory variants
export type MemoryWithTypes = Memory & {
  content: MemoryContent
  keyTopics: string[]
  tags: string[]
  participantIds: string[]
  embedding: number[]
}

export type ConversationMemory = MemoryWithTypes & {
  type: 'conversation'
  content: ConversationMessage[]
}

export type FactMemory = MemoryWithTypes & {
  type: 'fact'
  content: FactContent
}

export type PreferenceMemory = MemoryWithTypes & {
  type: 'preference'
  content: PreferenceContent
}

export type SkillMemory = MemoryWithTypes & {
  type: 'skill'
  content: SkillContent
}

// Utility types for UI and operations
export type MemorySummary = {
  id: string
  type: string
  category: string
  title: string
  description: string
  summary: string
  importance: number
  messageCount: number
  lastAccessedAt: Date | null
  createdAt: Date
  tags: string[]
}

export type MemorySearchResult = MemorySummary & {
  similarity: number
  relevantExcerpts: string[]
}

// Helper type for creating different memory types
export type CreateConversationMemory = Omit<
  NewMemory,
  'type' | 'messageCount'
> & {
  content: ConversationMessage[]
  messageCount?: number
}

export type CreateFactMemory = Omit<NewMemory, 'type' | 'messageCount'> & {
  content: FactContent
}

export type CreatePreferenceMemory = Omit<
  NewMemory,
  'type' | 'messageCount'
> & {
  content: PreferenceContent
}

export type CreateSkillMemory = Omit<NewMemory, 'type' | 'messageCount'> & {
  content: SkillContent
}
