import {
  agents,
  messages,
  messageType,
  memory,
  tools,
  cron,
  embedding,
  documents,
  prospects,
  prospectEvents,
  markets,
  contact,
  users,
  accounts,
  sessions,
  verificationTokens,
  organization,
  toolTypes,
} from './schema'

// Inferred table types
export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

export type Memory = typeof memory.$inferSelect
export type NewMemory = typeof memory.$inferInsert

export type Tool = typeof tools.$inferSelect
export type NewTool = typeof tools.$inferInsert

export type Cron = typeof cron.$inferSelect
export type NewCron = typeof cron.$inferInsert

export type Embedding = typeof embedding.$inferSelect
export type NewEmbedding = typeof embedding.$inferInsert

export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert

export type Prospect = typeof prospects.$inferSelect
export type NewProspect = typeof prospects.$inferInsert

export type ProspectEvent = typeof prospectEvents.$inferSelect
export type NewProspectEvent = typeof prospectEvents.$inferInsert

export type Market = typeof markets.$inferSelect
export type NewMarket = typeof markets.$inferInsert

export type MessageType = typeof messageType.$inferSelect
export type NewMessageType = typeof messageType.$inferInsert

export type Contact = typeof contact.$inferSelect
export type NewContact = typeof contact.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert

export type Organization = typeof organization.$inferSelect
export type NewOrganization = typeof organization.$inferInsert

export type ToolType = typeof toolTypes.$inferSelect
export type NewToolType = typeof toolTypes.$inferInsert

// JSON field types
export type MessageKind = 'info' | 'task' | 'workflow'

export type AgentPolicyDefinitions = {
  rules: AgentPolicyRule[]
}

export type AgentPolicyRule = {
  targetAgentId: string
  maxMessagesPerDay?: number
  maxStepsPerTask?: number
  messageType: string
}

export type AgentMemoryRules = {
  shouldStore: boolean
  maxMemoryItems?: number
  retentionDays?: number // 0 means forever
  rules: AgentMemoryRule[]
}

export type AgentMemoryRule = {
  messageType: string
  category?: string
  shouldStore: boolean
  retentionDays?: number // 0 means forever
}

export type AgentToolPermissions = {
  rules: AgentToolPermission[]
}

export type AgentToolPermission = {
  toolId: string
  maxUsagePerDay?: number // 0 means unlimited
  role?: string
}

export type PropertyName = string
export type PropertyValue = string

export type MetadataSchema = PropertyName[]

export type MetadataProperty = Record<PropertyName, PropertyValue>

export type MessageMetadata = {
  tags?: string[]
  message?: MetadataProperty
  task?: MetadataProperty
  workflow?: MetadataProperty[]
}

export type MemoryStructuredData = {
  type: string
  data: Record<string, unknown>
  schema?: Record<string, unknown>
}

// Enhance base types with typed JSON fields
export interface AgentWithTypes extends Agent {
  policyDefinitions: AgentPolicyDefinitions
  memoryRules: AgentMemoryRules
  toolPermissions: AgentToolPermissions
}

export interface MessageWithTypes extends Message {
  metadata: MessageMetadata
}

export interface MemoryWithTypes extends Memory {
  structuredData: MemoryStructuredData
}

export interface DocumentWithTypes extends Document {
  metadata: MetadataProperty
}

export interface ProspectWithTypes extends Prospect {
  metadata: MetadataProperty
}

export interface MarketWithTypes extends Market {
  metadata: MetadataProperty
}

export type ToolWithTypes = Tool & {
  configuration: Record<string, string>
  schema: Record<string, unknown>
  metadata: Record<string, unknown>
}

export type ContactType =
  | 'email'
  | 'telegram'
  | 'whatsapp'
  | 'sms'
  | 'vk'
  | 'phone'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'website'
  | 'other'
export interface ContactWithTypes extends Contact {
  type: ContactType
}

export type ToolTypeWithTypes = ToolType & {
  configurationParams: Record<
    string,
    {
      type: string
      description: string
    }
  >
}

export type OrganizationSettings = {
  organizationId: string
  messageTypes: MessageType[]
  tools: ToolWithTypes[]
  toolTypes: ToolType[]
  users: User[]
  sharedMemories: Memory[]
}
