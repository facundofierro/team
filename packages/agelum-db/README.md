# @agelum/db

Database schemas, ORM functions, and data access layer for the Agelum platform.

## Overview

This package provides the database layer for Agelum, including:

- Database schemas and migrations
- Reactive database functions using @drizzle/reactive
- Type-safe database operations
- Multi-tenant database support
- Memory management and search capabilities

## Features

- **Reactive Database Functions**: Real-time data synchronization using @drizzle/reactive
- **Multi-tenant Support**: Organization-scoped database operations
- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Memory Management**: Semantic search and memory storage
- **Agent Operations**: Agent management and conversation handling

## Usage

```typescript
import { db, reactiveDb } from '@agelum/db'
import { getAgents, createAgent } from '@agelum/db'

// Direct database operations
const agents = await db.agents.findMany({
  where: { organizationId: 'org-123' },
})

// Reactive functions
const { data: agents, isStale } = useReactive('agents.getAll', {
  organizationId: 'org-123',
})
```

## Database Functions

### Agents

- `getAgents` - Get all agents for an organization
- `createAgent` - Create a new agent
- `updateAgent` - Update agent configuration
- `deleteAgent` - Remove an agent

### Memory

- `getAgentMemories` - Retrieve agent memories
- `createMemory` - Store new memory
- `searchMemories` - Semantic memory search

### Organizations

- `getOrganizations` - Get user organizations
- `createOrganization` - Create new organization
- `updateOrganization` - Update organization settings

## Development

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Generate new migrations
pnpm db:gen

# Open Drizzle Studio
pnpm db:studio
```

## Architecture

The package follows the @drizzle/reactive pattern for real-time data synchronization:

1. **Reactive Functions**: Define database operations with automatic caching
2. **Relations Config**: Configure cache invalidation based on table relationships
3. **Multi-tenant**: Support for organization-scoped databases
4. **Type Safety**: Full TypeScript integration with Drizzle ORM

## Dependencies

- `@drizzle/reactive` - Reactive database library
- `drizzle-orm` - Type-safe ORM
- `@trpc/server` - Type-safe API layer
- `zod` - Schema validation
