import { defineReactiveFunction } from '@drizzle/reactive'
import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
import {
  organization,
  messageType,
  tools,
  toolTypes,
  users,
} from '../../schema'
import type {
  Organization,
  NewOrganization,
  OrganizationSettings,
  MessageType,
  ToolWithTypes,
  ToolType,
  User,
} from '../../types'
import { createOrgDatabaseAndSchemas } from '../utils/database'

// Schema for organization creation
const createOrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  databaseName: z.string(),
  databaseUrl: z.string().optional(),
})

// Get all organizations for a user
export const getOrganizations = defineReactiveFunction({
  name: 'organizations.getAll',
  input: z.object({
    userId: z.string(),
  }) as any,
  dependencies: ['organization'],
  handler: async (input, db) => {
    return db.db
      .select()
      .from(organization)
      .where(eq(organization.userId, input.userId))
  },
})

// Get a single organization by ID
export const getOrganization = defineReactiveFunction({
  name: 'organizations.getOne',
  input: z.object({
    id: z.string(),
  }) as any,
  dependencies: ['organization'],
  handler: async (input, db) => {
    const result = await db.db
      .select()
      .from(organization)
      .where(eq(organization.id, input.id))

    return result[0] || null
  },
})

// Create a new organization
export const createOrganization = defineReactiveFunction({
  name: 'organizations.create',
  input: createOrganizationSchema as any,
  dependencies: ['organization'],
  handler: async (input, db) => {
    // Create organization-specific database first
    await createOrgDatabaseAndSchemas(input.databaseName)

    const result = await db.db
      .insert(organization)
      .values(input as NewOrganization)
      .returning()

    return result[0] as Organization
  },
})

// Get organization settings (comprehensive view)
export const getOrganizationSettings = defineReactiveFunction({
  name: 'organizations.settings.getAll',
  input: z.object({
    organizationId: z.string(),
  }) as any,
  dependencies: ['organization', 'message_type', 'tool', 'tool_type', 'user'],
  handler: async (input, db) => {
    // Get message types for this organization
    const messageTypes = await db.db
      .select()
      .from(messageType)
      .where(eq(messageType.organizationId, input.organizationId))
      .orderBy(asc(messageType.name))

    // Get organization tools
    const organizationTools = await db.db
      .select()
      .from(tools)
      .where(eq(tools.organizationId, input.organizationId))
      .orderBy(asc(tools.name))

    // Get all tool types (global)
    const allToolTypes = await db.db
      .select()
      .from(toolTypes)
      .orderBy(asc(toolTypes.type))

    // Get organization users
    const organizationUsers = await db.db
      .select()
      .from(users)
      .where(eq(users.organizationId, input.organizationId))
      .orderBy(asc(users.name))

    return {
      organizationId: input.organizationId,
      messageTypes: messageTypes as MessageType[],
      tools: organizationTools.map((tool: any) => ({
        ...tool,
        configuration: tool.configuration as Record<string, string>,
        schema: tool.schema as Record<string, unknown>,
        metadata: tool.metadata as Record<string, unknown>,
      })) as ToolWithTypes[],
      toolTypes: allToolTypes as ToolType[],
      users: organizationUsers as User[],
    } as OrganizationSettings
  },
})

// Update organization settings
export const updateOrganizationSettings = defineReactiveFunction({
  name: 'organizations.settings.update',
  input: z.object({
    organizationId: z.string(),
    settings: z.object({
      messageTypes: z.array(z.any()).optional(),
      tools: z.array(z.any()).optional(),
      users: z.array(z.any()).optional(),
    }),
  }) as any,
  dependencies: ['message_type', 'tool', 'user'],
  handler: async (input, db) => {
    const { organizationId, settings } = input

    // This is a simplified implementation
    // In a real scenario, you'd want to handle each type of update separately
    // and potentially create separate reactive functions for each

    // For now, just return the organization ID to indicate success
    return { organizationId, updated: true }
  },
})
