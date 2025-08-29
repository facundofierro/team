/**
 * Client-safe reactive configuration
 * This file only contains serializable configuration data, no database connections
 */

// Reactive relations configuration (shared between server and client)
export const reactiveRelations = {
  // When agent changes, invalidate these queries
  agent: ['organization.id', 'message.fromAgentId', 'message.toAgentId'],

  // When organization changes, invalidate these queries
  organization: ['agent.organizationId', 'tool.organizationId'],

  // When message changes, invalidate these queries
  message: ['agent.fromAgentId', 'agent.toAgentId'],

  // When tool changes, invalidate these queries
  tool: ['organization.id'],

  // When user changes, invalidate these queries
  user: ['organization.userId'],

  // When message type changes, invalidate these queries
  message_type: ['organization.id'],

  // When tool type changes, invalidate these queries
  tool_type: [],

  // When cron changes, invalidate these queries
  cron: ['organization.id', 'message.messageId'],
}
