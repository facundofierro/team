# Task 2: Implement @drizzle/reactive in TeamHub - Phase 1 (Main Database)

## Overview

Implement the newly created `@drizzle/reactive` package in TeamHub, starting with the main database (agency/auth schemas) as a foundational step. This is the first phase of a multi-phase rollout to validate the integration approach before expanding to organization-specific databases.

## Current State Analysis

### TeamHub Database Architecture

- **Main Database (`teamhub`)**: Contains agency and auth schemas
  - `agency` schema: organizations, agents, messages, tools, cron, messageTypes, toolTypes
  - `auth` schema: users, accounts, sessions, verificationTokens
- **Organization Databases**: Per-organization databases for memory, insights, embeddings
- **Current DB Access**: Direct Drizzle functions without reactive features

### Current Database Functions Structure

Location: `packages/teamhub-db/src/db/functions/agency.ts`

- `createOrganization()`, `getOrganizations()`, `getOrganizationSettings()`
- `createAgent()`, `getAgent()`, `getAgents()`, `updateAgent()`, `deleteAgent()`
- `createTool()`, `getTools()`, `updateTool()`, `deleteTool()`
- Direct Drizzle queries without caching or real-time features

### Current API Structure

- REST endpoints in `apps/teamhub/src/app/api/`
- No tRPC implementation currently
- Direct database function calls from API routes

## Implementation Scope (Phase 1)

### Focus: Main Database Only

Start with the main `teamhub` database (agency/auth schemas) to:

1. Validate @drizzle/reactive integration approach
2. Establish patterns for future organization database migrations
3. Minimize complexity by focusing on one database system
4. Test real-time features on core entities (agents, organizations, tools)

### Out of Scope (Future Phases)

- Organization-specific databases (memory, insights, embeddings)
- Complex multi-database relations
- Migration of existing organization data

## Detailed Implementation Plan

### Step 1: Configure Reactive Database (1-2 days)

#### 1.1 Update Main Database Configuration

**File**: `packages/teamhub-db/src/db/index.ts`

```typescript
// Before
export const db = drizzle(pool, { schema })

// After
import { createReactiveDb } from '@drizzle/reactive'

const reactiveConfig = {
  relations: {
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
  },
}

export const db = createReactiveDb(drizzle(pool, { schema }), reactiveConfig)
```

#### 1.2 Create Reactive Function Definitions

**File**: `packages/teamhub-db/src/db/functions/reactive/agents.ts`

```typescript
import { defineReactiveFunction } from '@drizzle/reactive'
import { z } from 'zod'

export const getAgents = defineReactiveFunction({
  name: 'agents.getAll',
  input: z.object({
    organizationId: z.string(),
    limit: z.number().optional().default(50),
  }),
  dependencies: ['agent'],
  handler: async (input, db) => {
    return db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, input.organizationId))
      .limit(input.limit)
  },
})

export const getAgent = defineReactiveFunction({
  name: 'agents.getOne',
  input: z.object({
    id: z.string(),
  }),
  dependencies: ['agent'],
  handler: async (input, db) => {
    return db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id))
      .then((results) => results[0])
  },
})

export const createAgent = defineReactiveFunction({
  name: 'agents.create',
  input: z.object({
    organizationId: z.string(),
    name: z.string(),
    role: z.string(),
    systemPrompt: z.string().optional(),
    // ... other agent fields
  }),
  dependencies: ['agent'],
  handler: async (input, db) => {
    return db.insert(agents).values(input).returning()
  },
})

export const updateAgent = defineReactiveFunction({
  name: 'agents.update',
  input: z.object({
    id: z.string(),
    data: z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      systemPrompt: z.string().optional(),
      // ... other updateable fields
    }),
  }),
  dependencies: ['agent'],
  handler: async (input, db) => {
    return db
      .update(agents)
      .set(input.data)
      .where(eq(agents.id, input.id))
      .returning()
  },
})
```

#### 1.3 Create Reactive Function Definitions for Organizations

**File**: `packages/teamhub-db/src/db/functions/reactive/organizations.ts`

```typescript
export const getOrganizations = defineReactiveFunction({
  name: 'organizations.getAll',
  input: z.object({
    userId: z.string(),
  }),
  dependencies: ['organization'],
  handler: async (input, db) => {
    return db
      .select()
      .from(organization)
      .where(eq(organization.userId, input.userId))
  },
})

export const createOrganization = defineReactiveFunction({
  name: 'organizations.create',
  input: z.object({
    name: z.string(),
    userId: z.string(),
    databaseName: z.string(),
    databaseUrl: z.string().optional(),
  }),
  dependencies: ['organization'],
  handler: async (input, db) => {
    // Include database creation logic from existing function
    await createOrgDatabaseAndSchemas(input.databaseName)
    return db.insert(organization).values(input).returning()
  },
})
```

### Step 2: Implement tRPC Integration (1-2 days)

#### 2.1 Create Reactive tRPC Router

**File**: `packages/teamhub-db/src/trpc/router.ts`

```typescript
import { createReactiveRouter } from '@drizzle/reactive/trpc'
import { db } from '../db'
import * as agentFunctions from '../db/functions/reactive/agents'
import * as organizationFunctions from '../db/functions/reactive/organizations'

export const appRouter = createReactiveRouter({ db })
  // Agent procedures
  .addQuery(agentFunctions.getAgents) // -> agents.getAll
  .addQuery(agentFunctions.getAgent) // -> agents.getOne
  .addMutation(agentFunctions.createAgent) // -> agents.create
  .addMutation(agentFunctions.updateAgent) // -> agents.update

  // Organization procedures
  .addQuery(organizationFunctions.getOrganizations) // -> organizations.getAll
  .addMutation(organizationFunctions.createOrganization) // -> organizations.create

export type AppRouter = typeof appRouter
```

#### 2.2 Add tRPC API Endpoint

**File**: `apps/teamhub/src/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@teamhub/db/trpc/router'
import { auth } from '@/auth'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth()
      return {
        session,
        // Add any other context needed
      }
    },
  })

export { handler as GET, handler as POST }
```

### Step 3: Add Server-Sent Events for Real-time Updates (1 day)

#### 3.1 Create SSE Endpoint

**File**: `apps/teamhub/src/app/api/events/route.ts`

```typescript
import { createSSEStream } from '@drizzle/reactive'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')

  if (!organizationId) {
    return new Response('Organization ID required', { status: 400 })
  }

  // TODO: Verify user has access to this organization

  return createSSEStream(organizationId)
}
```

#### 3.2 Add SSE Acknowledgment Endpoint

**File**: `apps/teamhub/src/app/api/events/ack/route.ts`

```typescript
import { acknowledgeEvent } from '@drizzle/reactive'

export async function POST(request: Request) {
  const { eventId } = await request.json()
  acknowledgeEvent(eventId)
  return new Response('OK')
}
```

### Step 4: Update Client-Side Integration (2-3 days)

#### 4.1 Install and Configure tRPC Client

**File**: `apps/teamhub/src/lib/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@teamhub/db/trpc/router'

export const trpc = createTRPCReact<AppRouter>()
```

#### 4.2 Add Reactive Provider

**File**: `apps/teamhub/src/Providers.tsx`

```typescript
import { ReactiveProvider } from '@drizzle/reactive'
import { TRPCReactProvider } from './lib/trpc-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ReactiveProvider
        config={{
          relations: {
            agent: ['organization.id', 'message.fromAgentId'],
            organization: ['agent.organizationId', 'tool.organizationId'],
            // ... same as server config
          },
        }}
      >
        {children}
      </ReactiveProvider>
    </TRPCReactProvider>
  )
}
```

#### 4.3 Update Components to Use Reactive Hooks

**File**: `apps/teamhub/src/components/agents/AgentsList.tsx`

```typescript
import { useReactive } from '@drizzle/reactive'

export function AgentsList({ organizationId }: { organizationId: string }) {
  const {
    data: agents,
    isLoading,
    isStale,
  } = useReactive('agents.getAll', { organizationId })

  if (isLoading) return <div>Loading agents...</div>

  return (
    <div>
      {isStale && <div className="text-orange-500">Syncing...</div>}

      {agents?.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}
```

### Step 5: Migrate Existing API Routes (1-2 days)

#### 5.1 Update REST API Routes to Use Reactive Functions

**File**: `apps/teamhub/src/app/api/agents/route.ts`

```typescript
// Before: Direct database calls
const agents = await db.getAgents(organizationId)

// After: Use reactive functions directly
import { getAgents } from '@teamhub/db/functions/reactive/agents'
import { db } from '@teamhub/db'

const agents = await getAgents.execute({ organizationId }, db)
```

#### 5.2 Maintain Backward Compatibility

Keep existing REST endpoints working during transition period, but internally use reactive functions for consistency.

### Step 6: Testing and Validation (1-2 days)

#### 6.1 Unit Tests for Reactive Functions

**File**: `packages/teamhub-db/src/db/functions/reactive/__tests__/agents.test.ts`

```typescript
import { getAgents, createAgent } from '../agents'
import { db } from '../../index'

describe('Reactive Agent Functions', () => {
  test('getAgents returns filtered results', async () => {
    const result = await getAgents.execute({ organizationId: 'test-org' }, db)
    expect(Array.isArray(result)).toBe(true)
  })

  test('createAgent invalidates cache automatically', async () => {
    // Test cache invalidation behavior
  })
})
```

#### 6.2 Integration Tests for Real-time Updates

Test SSE invalidation when data changes:

1. Create agent via tRPC mutation
2. Verify SSE event is broadcast
3. Confirm client cache is invalidated

## Success Criteria

### Functional Requirements

- ✅ Agents can be created, read, updated via reactive functions
- ✅ Organizations can be created, read via reactive functions
- ✅ tRPC procedures work with type safety
- ✅ Real-time updates work via SSE
- ✅ Cache invalidation happens automatically
- ✅ Existing REST APIs continue to work

### Performance Requirements

- ✅ Cache hit rate >80% for read operations
- ✅ SSE invalidation latency <500ms
- ✅ No regression in API response times
- ✅ Client shows cached data instantly

### Developer Experience

- ✅ Single source of truth for database operations
- ✅ Automatic type safety without manual setup
- ✅ Zero configuration for basic caching
- ✅ Clear migration path established

## Risks and Mitigation

### Risk 1: Performance Impact

**Risk**: New reactive layer could slow down operations
**Mitigation**:

- Benchmark before/after implementation
- Use selective dependencies to minimize invalidations
- Monitor cache hit rates

### Risk 2: Complex Multi-Database Relations

**Risk**: TeamHub's multi-database architecture may complicate relations
**Mitigation**:

- Start with main database only (this phase)
- Define clear boundaries for phase 1
- Test patterns before expanding

### Risk 3: Breaking Changes

**Risk**: Changes could break existing functionality
**Mitigation**:

- Maintain backward compatibility
- Gradual migration of endpoints
- Comprehensive testing

## Future Phases

### Phase 2: Organization Database Integration

- Extend reactive patterns to organization-specific databases
- Implement memory/insights/embeddings reactive functions
- Handle cross-database relations

### Phase 3: Full Migration and Optimization

- Complete migration of all database operations
- Remove legacy database functions
- Performance optimization and monitoring

### Phase 4: Advanced Features

- Optimistic updates
- Background revalidation
- Advanced caching strategies

## Dependencies

### Required Packages

- `@drizzle/reactive` (already implemented)
- `@trpc/server`, `@trpc/client`, `@trpc/react-query`
- `zod` for input validation

### Environment Variables

No new environment variables required for phase 1.

### Infrastructure

- Redis for SSE event broadcasting (optional, can use memory for testing)
- No changes to existing PostgreSQL setup required

## Timeline Estimate

**Total: 7-10 days**

- Step 1: Configure Reactive Database (1-2 days)
- Step 2: Implement tRPC Integration (1-2 days)
- Step 3: Add SSE for Real-time Updates (1 day)
- Step 4: Update Client-Side Integration (2-3 days)
- Step 5: Migrate Existing API Routes (1-2 days)
- Step 6: Testing and Validation (1-2 days)

## Getting Started

1. Start with Step 1: Update `packages/teamhub-db/src/db/index.ts`
2. Create reactive function definitions for agents
3. Set up basic tRPC integration
4. Test with a simple component before expanding

This foundation will establish the patterns for all future reactive database integrations in TeamHub.
