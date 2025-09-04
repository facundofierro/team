import type { ConversationMemory } from '@agelum/db'

export interface ContextConfig {
  maxRecentMessages: number // Default: 20
  maxTokensPerRequest: number // Default: 8000
  summaryTokenBudget: number // Default: 500
  enableMemoryAugmentation: boolean // Default: true
  forceFullContext: boolean // Default: false (for debugging)
}

export interface OptimizedContext {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  summary?: string
  totalTokenEstimate: number
  contextStrategy: 'full' | 'windowed' | 'summary-only'
  messageCount: {
    original: number
    included: number
    summarized: number
  }
}

const DEFAULT_CONFIG: ContextConfig = {
  maxRecentMessages: 20,
  maxTokensPerRequest: 8000,
  summaryTokenBudget: 500,
  enableMemoryAugmentation: true,
  forceFullContext: false,
}

/**
 * Estimates token count for messages (rough approximation)
 * Uses 4 characters ≈ 1 token rule of thumb
 */
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Estimates total token count for an array of messages
 */
function estimateMessagesTokenCount(
  messages: Array<{ role: string; content: string }>
): number {
  return messages.reduce((total, msg) => {
    return total + estimateTokenCount(msg.content) + 10 // +10 for role and structure overhead
  }, 0)
}

/**
 * Retrieves conversation summary from the conversation memory
 */
function getConversationSummary(
  currentConversation: ConversationMemory | null
): string | undefined {
  if (!currentConversation?.summary) {
    return undefined
  }

  // Validate that the summary is meaningful
  const summary = currentConversation.summary.trim()
  if (summary.length < 10 || summary === '{}' || summary === '[]') {
    return undefined
  }

  return summary
}

/**
 * Builds optimized context for AI requests by limiting recent messages and including summary
 */
export function buildOptimizedContext(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentConversation: ConversationMemory | null,
  config: Partial<ContextConfig> = {}
): OptimizedContext {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  console.log('🔧 Context Optimizer: Building optimized context')
  console.log('🔧 Context Optimizer: Original message count:', messages.length)
  console.log('🔧 Context Optimizer: Config:', finalConfig)

  // If force full context is enabled (for debugging), return all messages
  if (finalConfig.forceFullContext) {
    console.log(
      '🔧 Context Optimizer: Force full context enabled, returning all messages'
    )
    return {
      messages,
      summary: undefined,
      totalTokenEstimate: estimateMessagesTokenCount(messages),
      contextStrategy: 'full',
      messageCount: {
        original: messages.length,
        included: messages.length,
        summarized: 0,
      },
    }
  }

  // If we have fewer messages than the window, return all messages
  if (messages.length <= finalConfig.maxRecentMessages) {
    console.log(
      '🔧 Context Optimizer: Message count within window, returning all messages'
    )
    return {
      messages,
      summary: undefined,
      totalTokenEstimate: estimateMessagesTokenCount(messages),
      contextStrategy: 'full',
      messageCount: {
        original: messages.length,
        included: messages.length,
        summarized: 0,
      },
    }
  }

  // Get recent messages (last N messages)
  const recentMessages = messages.slice(-finalConfig.maxRecentMessages)
  const recentTokenCount = estimateMessagesTokenCount(recentMessages)

  console.log(
    '🔧 Context Optimizer: Recent messages count:',
    recentMessages.length
  )
  console.log(
    '🔧 Context Optimizer: Recent messages token estimate:',
    recentTokenCount
  )

  // Try to get conversation summary
  const summary = getConversationSummary(currentConversation)
  const summaryTokenCount = summary ? estimateTokenCount(summary) : 0

  console.log('🔧 Context Optimizer: Summary available:', !!summary)
  console.log(
    '🔧 Context Optimizer: Summary token estimate:',
    summaryTokenCount
  )

  // Calculate total token count
  const totalTokenEstimate = recentTokenCount + summaryTokenCount

  console.log('🔧 Context Optimizer: Total token estimate:', totalTokenEstimate)

  // Check if we're within token budget
  if (totalTokenEstimate > finalConfig.maxTokensPerRequest) {
    console.warn(
      '⚠️ Context Optimizer: Token estimate exceeds budget, may need further optimization'
    )
  }

  // Determine context strategy
  let contextStrategy: OptimizedContext['contextStrategy'] = 'windowed'
  if (summary && messages.length > finalConfig.maxRecentMessages) {
    contextStrategy = 'windowed' // Using both recent messages and summary
  } else if (summary && !recentMessages.length) {
    contextStrategy = 'summary-only' // Only summary (edge case)
  }

  const result: OptimizedContext = {
    messages: recentMessages,
    summary,
    totalTokenEstimate,
    contextStrategy,
    messageCount: {
      original: messages.length,
      included: recentMessages.length,
      summarized: messages.length - recentMessages.length,
    },
  }

  console.log('🔧 Context Optimizer: Optimization complete')
  console.log('🔧 Context Optimizer: Strategy:', result.contextStrategy)
  console.log('🔧 Context Optimizer: Message counts:', result.messageCount)

  return result
}

/**
 * Creates a summary message for inclusion in the AI context
 */
export function createSummaryMessage(summary: string): {
  role: 'system'
  content: string
} {
  return {
    role: 'system',
    content: `Previous conversation summary: ${summary}`,
  }
}

/**
 * Helper function to format context optimization info for logging
 */
export function formatOptimizationInfo(context: OptimizedContext): string {
  const { messageCount, contextStrategy, totalTokenEstimate } = context
  const reductionPercent =
    messageCount.original > 0
      ? Math.round(
          ((messageCount.original - messageCount.included) /
            messageCount.original) *
            100
        )
      : 0

  return [
    `Strategy: ${contextStrategy}`,
    `Messages: ${messageCount.included}/${messageCount.original} (${reductionPercent}% reduction)`,
    `Tokens: ~${totalTokenEstimate}`,
    `Summary: ${context.summary ? 'included' : 'not available'}`,
  ].join(' | ')
}
