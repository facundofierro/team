# @drizzle/reactive - Reactive Database Library

## Vision

**Zero configuration, maximum intelligence. Reactive everywhere with no boilerplate.**

```typescript
// server/db.ts - Minimal setup
export const db = createReactiveDb(drizzle, {
  relations: {
    agent: ['organization', 'message.fromAgentId', 'memory.agentId'],
    organization: ['agent.organizationId', 'tool.organizationId'],
  },
})

// client/hooks.ts - Zero configuration usage
const { data: agents } = useReactive('agents.findMany', { organizationId })
// ✅ Shows cache instantly
// ✅ Smart revalidation (only active hooks first)
// ✅ Auto real-time mode
// ✅ Handles page refresh gracefully
// ✅ Recovers missed events
// ✅ Type-safe with tRPC
```

## Core Architecture

### Real-time Transport: Server-Sent Events (SSE)

**Why SSE over WebSockets**: Perfect for unidirectional cache invalidation with maximum compatibility and reliability.

```typescript
// SSE is ideal for reactive cache invalidation because:
// ✅ Server-to-client only (we don't need bidirectional)
// ✅ Vercel compatible (works with serverless)
// ✅ Auto-reconnection (browser handles it)
// ✅ HTTP-based (proxy-friendly, no firewall issues)
// ✅ Simple implementation (standard HTTP streaming)
// ✅ No wasteful heartbeats (connection stays alive naturally)
// ✅ Event acknowledgments (reliable delivery without periodic messages)

const invalidationEvent = {
  type: 'invalidation',
  table: 'agents',
  organizationId: 'org-123',
  affectedQueries: ['agents.getAll', 'agents.getWithStats'],
  eventId: 'evt_123', // For acknowledgment tracking
  requiresAck: true, // Important events get delivery confirmation
}
// Perfect fit for reliable cache invalidation ✅
```

### SQL Interception Engine

**Key Innovation**: Intercept ALL Drizzle SQL execution using custom database drivers.

```typescript
// Every query passes through our reactive layer
const reactiveDriver = async (sql: string, params: any[]) => {
  const metadata = analyzeSql(sql, params) // Extract table, operation, keys

  // SELECT: Check cache → Execute → Cache result
  // INSERT/UPDATE/DELETE: Execute → Invalidate related → Broadcast

  return handleReactiveQuery(metadata)
}

const db = drizzle(reactiveDriver, { schema })
```

**Automatic Detection**: From any SQL query, extract:

- Table name and schema
- Operation type (SELECT/INSERT/UPDATE/DELETE)
- WHERE condition keys and values
- Related tables to invalidate

### Zero-Configuration System

The system is intelligent by default, requiring minimal configuration:

```typescript
// Minimal configuration - only relations needed
export interface ReactiveConfig {
  // Table relationships for automatic invalidation
  relations: Record<string, string[]>

  // Optional overrides (smart defaults used)
  cache?: {
    server?: { provider?: 'redis' | 'memory' }
    client?: { provider?: 'localStorage' | 'sessionStorage' }
  }
  realtime?: {
    enabled?: boolean
    transport?: 'sse' // Server-Sent Events for real-time cache invalidation
    fallback?: 'polling' // Graceful degradation when SSE fails
    reliability?: {
      acknowledgments?: boolean // Event ack system for reliable delivery
      maxRetries?: number // Retry attempts for unacknowledged events
      retryDelays?: number[] // Exponential backoff delays
      periodicHeartbeat?: false // No wasteful heartbeats needed
    }
  }
}

// Smart client-side cache with localStorage registry
interface QueryRegistry {
  organizationId: string
  queries: {
    [queryKey: string]: {
      lastRevalidated: number
      lastServerChange?: number
      data?: any
    }
  }
  session: {
    startTime: number
    lastSync: number
    realtimeConnected: boolean
  }
}
```

### tRPC Integration

Type-safe communication with automatic reactive features:

```typescript
// server/trpc/router.ts
import { createReactiveRouter } from '@drizzle/reactive/trpc'

export const appRouter = createReactiveRouter({
  config: reactiveConfig,
  db: reactiveDb,
})
  .query('agents.findMany', {
    input: z.object({ organizationId: z.string() }),
    resolve: ({ input }) => db.agent.findMany({ where: input }),
  })
  .mutation('agents.update', {
    input: z.object({ id: z.string(), data: agentUpdateSchema }),
    resolve: ({ input }) =>
      db.agent.update({ where: { id: input.id }, data: input.data }),
  })

// Auto-generates:
// ✅ Cache keys from query inputs
// ✅ Invalidation patterns from relations config
// ✅ Real-time subscriptions
// ✅ Optimistic update handlers
```

### Reactive Function Definition

Standard way to define reactive functions with explicit dependencies:

```typescript
import { defineReactiveFunction } from '@drizzle/reactive'

// Define functions with explicit cache dependencies
export const getAgentWithStats = defineReactiveFunction({
  // Input validation (like tRPC)
  input: z.object({
    agentId: z.string(),
    organizationId: z.string(),
  }),

  // Cache dependencies - what tables this function reads from
  dependencies: ['agent', 'message', 'memory'],

  // Optional: specific invalidation conditions
  invalidateWhen: {
    agent: (change) => change.keys.includes(input.agentId),
    message: (change) => change.keys.includes(input.agentId),
    memory: (change) => change.keys.includes(input.agentId),
  },

  // The actual function logic
  handler: async ({ input, db }) => {
    const agent = await db.agents.findUnique({ where: { id: input.agentId } })
    const messageCount = await db.messages.count({
      where: { fromAgentId: input.agentId },
    })
    const memoryCount = await db.memory.count({
      where: { agentId: input.agentId },
    })

    return { agent, messageCount, memoryCount }
  },
})

// Auto-generate tRPC router from reactive functions
export const appRouter = createReactiveRouter({
  agents: {
    getAll: getAgents,
    getWithStats: getAgentWithStats,
    update: updateAgent,
  },
})
// ✅ Automatically creates tRPC procedures
// ✅ Generates cache keys from inputs
// ✅ Sets up invalidation rules
// ✅ Manages subscriptions
```

### Zero-Configuration Client API

```typescript
// Single hook with intelligent defaults - no configuration needed
function useReactive<T>(
  operation: keyof AppRouter,
  input?: any
): {
  data: T | undefined
  isLoading: boolean
  isStale: boolean // Is data from cache?
  error: Error | null
}

// Usage - completely zero config!
const { data: agents, isStale } = useReactive('agents.getAll', {
  organizationId,
})
// ✅ Shows cache instantly
// ✅ Auto-subscribes only to 'agent' table events (selective)
// ✅ Auto-revalidates based on dependencies
// ✅ Switches to real-time automatically
// ✅ Handles page refresh gracefully

// Selective subscriptions - only reacts to relevant changes
function AgentList({ organizationId }) {
  const { data: agents } = useReactive('agents.getAll', { organizationId })
  // ✅ Only subscribes to agent table events
  // ✅ Ignores message/memory events (efficiency)

  return (
    <div>
      {agents?.map((agent) => (
        <AgentCard key={agent.id} />
      ))}
    </div>
  )
}

function MessagesView({ conversationId }) {
  const { data: messages } = useReactive('messages.getAll', { conversationId })
  // ✅ Only subscribes to message table events
  // ✅ Doesn't waste bandwidth on unrelated tables

  return (
    <div>
      {messages?.map((msg) => (
        <MessageCard key={msg.id} />
      ))}
    </div>
  )
}

// Optional: Page-level priority hints for better UX
const AgentsPage = () => {
  useReactivePriorities(['agents.getOne', 'tools.available']) // Next likely queries
  return <AgentList organizationId="org-123" />
}
```

## Implementation Strategy

### Phase 1: Core Engine (1 week)

- [ ] SQL interception using custom Drizzle driver
- [ ] Basic SQL analysis (table, operation, keys extraction)
- [ ] localStorage query registry
- [ ] Smart revalidation based on active hooks

### Phase 2: Intelligent Caching (1 week)

- [ ] Session gap detection and recovery
- [ ] Server-side change tracking
- [ ] Priority-based revalidation (active hooks first)
- [ ] Background revalidation with delays

### Phase 3: Real-time Integration (1 week)

- [ ] Server-Sent Events (SSE) implementation
- [ ] Automatic reconnection and error handling
- [ ] Polling fallback for reliability
- [ ] Event-driven cache invalidation
- [ ] Vercel and self-hosted compatibility

### Phase 4: Zero-Config Polish (1 week)

- [ ] Automatic cleanup and size management
- [ ] Performance optimization
- [ ] Error recovery and graceful degradation
- [ ] Optional page-level priority hints

### Phase 5: AI Assistant Integration (1 week)

- [ ] Generate Cursor IDE rules for AI assistant guidance
- [ ] Create code analysis tools for dependency detection
- [ ] Develop AI-powered migration helpers
- [ ] Build function template generators
- [ ] Documentation and examples for AI assistants

## Configuration Examples

### Minimal Setup (Zero Config)

```typescript
// reactive.config.ts - Only relations needed
export const config = {
  relations: {
    agent: ['organization', 'message.fromAgentId', 'memory.agentId'],
    organization: ['agent.organizationId', 'tool.organizationId'],
    message: ['agent.fromAgentId', 'agent.toAgentId'],
  },
  // ✅ Smart defaults for everything else:
  // - localStorage registry
  // - Active hooks priority
  // - Auto real-time mode
  // - Exponential backoff retry
  // - Session gap recovery
}
```

### Server-Sent Events with Reliable Delivery

```typescript
// Efficient SSE with event acknowledgment (no wasteful heartbeats)
interface PendingEvent {
  id: string
  organizationId: string
  data: any
  timestamp: number
  delivered: boolean
  retryCount: number
  maxRetries: number
}

class ReliableSSEDelivery {
  private pendingEvents = new Map<string, PendingEvent>()
  private retrySchedule = [2000, 5000, 10000] // 2s, 5s, 10s

  async broadcastInvalidation(organizationId: string, invalidationData: any) {
    const eventId = generateId()
    const event: PendingEvent = {
      id: eventId,
      organizationId,
      data: { ...invalidationData, eventId, requiresAck: true },
      timestamp: Date.now(),
      delivered: false,
      retryCount: 0,
      maxRetries: 3,
    }

    // Store for potential retry
    this.pendingEvents.set(eventId, event)

    // Send initial event via SSE
    await this.sendEventViaSSE(organizationId, event.data)

    // Schedule retry if no ack received
    this.scheduleRetryIfNeeded(eventId)
  }

  private scheduleRetryIfNeeded(eventId: string) {
    const event = this.pendingEvents.get(eventId)
    if (!event || event.delivered) return

    const delay = this.retrySchedule[event.retryCount] || 10000

    setTimeout(async () => {
      const currentEvent = this.pendingEvents.get(eventId)
      if (!currentEvent || currentEvent.delivered) return

      if (currentEvent.retryCount < currentEvent.maxRetries) {
        currentEvent.retryCount++
        await this.sendEventViaSSE(currentEvent.organizationId, {
          ...currentEvent.data,
          retry: currentEvent.retryCount,
        })
        this.scheduleRetryIfNeeded(eventId)
      } else {
        // Failed after max retries
        this.pendingEvents.delete(eventId)
      }
    }, delay)
  }

  // Client acknowledges receipt
  acknowledgeEvent(eventId: string) {
    const event = this.pendingEvents.get(eventId)
    if (event) {
      event.delivered = true
      this.pendingEvents.delete(eventId) // Clean up immediately
    }
  }
}

// SSE endpoint - no heartbeats needed!
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const subscriber = redis.subscribe(`invalidation:${organizationId}`)

      subscriber.on('message', (channel, message) => {
        const invalidationData = JSON.parse(message)
        const sseData = `data: ${JSON.stringify(invalidationData)}\n\n`
        controller.enqueue(encoder.encode(sseData))
      })

      // Cleanup on disconnect - no heartbeat cleanup needed
      request.signal.addEventListener('abort', () => {
        subscriber.unsubscribe()
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Client-side: Smart acknowledgment without periodic messages
class SmartSSEManager {
  private eventSource: EventSource | null = null

  connect(organizationId: string) {
    this.eventSource = new EventSource(
      `/api/events?organizationId=${organizationId}`
    )

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'invalidation') {
        this.handleInvalidation(data)

        // Send ack ONLY for events that require it
        if (data.requiresAck && data.eventId) {
          this.sendAck(data.eventId)
        }
      }
    }

    this.eventSource.onerror = () => {
      console.log('SSE connection lost, will auto-reconnect')
      // Browser automatically reconnects - no manual intervention needed
    }
  }

  private async sendAck(eventId: string) {
    try {
      // Simple HTTP POST - no response needed
      fetch('/api/events/ack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      }).catch(() => {}) // Silent fail - server will retry anyway
    } catch (error) {
      // Ignore ack failures - server retry will handle it
    }
  }

  private handleInvalidation(data: InvalidationEvent) {
    // Invalidate affected queries in React Query
    data.affectedQueries.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey })
    })
  }
}
```

### Smart Priority System

```typescript
// Priority based on active hooks, not static config
async function revalidateOnPageLoad() {
  // 1. Active hooks first (what user sees) - immediate
  const activeQueries = Array.from(this.activeHooks)
  await Promise.all(activeQueries.map(q => this.revalidateQuery(q)))

  // 2. Background revalidation after delay - non-blocking
  setTimeout(() => {
    this.revalidateBackgroundQueries(excluding: activeQueries)
  }, 2000)

  // 3. Optional: Page context hints
  if (this.pageContext.length > 0) {
    setTimeout(() => {
      this.revalidatePageContext()
    }, 1000)
  }
}
```

### AI-Assisted Development

```typescript
// AI analyzes function code and suggests dependencies
function analyzeFunction(functionCode: string): AnalysisResult {
  return {
    suggestedDependencies: ['agent', 'message', 'memory'],
    detectedQueries: [
      { table: 'agents', operation: 'findUnique', columns: ['id'] },
      { table: 'messages', operation: 'count', columns: ['fromAgentId'] },
      { table: 'memory', operation: 'count', columns: ['agentId'] },
    ],
    invalidationRecommendations: {
      agent: 'specific', // Only invalidate for this specific agent
      message: 'conditional', // Only when fromAgentId matches
      memory: 'conditional', // Only when agentId matches
    },
  }
}

// Development helper with AI suggestions
export const getAgentWithStats = defineReactiveFunction({
  input: z.object({ agentId: z.string() }),

  // AI-suggested dependencies (developer can override)
  dependencies: ['agent', 'message', 'memory'], // <- AI generated

  handler: async ({ input, db }) => {
    // AI analyzes this code and detects table usage
    const agent = await db.agents.findUnique({ where: { id: input.agentId } })
    const messageCount = await db.messages.count({
      where: { fromAgentId: input.agentId },
    })
    const memoryCount = await db.memory.count({
      where: { agentId: input.agentId },
    })

    return { agent, messageCount, memoryCount }
  },
})
```

## Package Structure

```
packages/drizzle-reactive/
├── src/
│   ├── core/
│   │   ├── driver.ts          # Custom Drizzle driver
│   │   ├── analyzer.ts        # SQL analysis engine
│   │   ├── cache.ts           # Cache management
│   │   └── invalidation.ts    # Relation-based invalidation
│   ├── trpc/
│   │   ├── router.ts          # Reactive tRPC router
│   │   ├── middleware.ts      # Cache middleware
│   │   └── types.ts           # tRPC type definitions
│   ├── client/
│   │   ├── hooks.ts           # React hooks
│   │   ├── storage.ts         # Client-side storage
│   │   └── sync.ts            # Real-time sync
│   ├── providers/
│   │   ├── redis.ts           # Redis cache provider
│   │   ├── memory.ts          # Memory cache provider
│   │   └── localStorage.ts    # Browser storage provider
│   └── config/
│       ├── schema.ts          # Configuration schema validation
│       └── loader.ts          # Configuration loader
└── examples/
    └── teamhub/               # TeamHub integration example
```

## Usage Flow

### 1. Configuration

```typescript
// reactive.config.ts - Single source of truth
export const reactiveConfig = {
  /* ... */
}
```

### 2. Server Setup

```typescript
// server/db.ts
import { createReactiveDb } from '@drizzle/reactive'
import { reactiveConfig } from './reactive.config'

export const db = createReactiveDb(drizzle(pool), reactiveConfig)

// server/trpc.ts
import { createReactiveRouter } from '@drizzle/reactive/trpc'

export const appRouter = createReactiveRouter({ db, config: reactiveConfig })

// app/api/events/route.ts - SSE endpoint for Vercel/Next.js
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')

  return createSSEStream(organizationId) // Auto-generated SSE endpoint
}
```

### 3. Client Usage

```typescript
// components/AgentList.tsx - Zero configuration needed
function AgentList({ organizationId }) {
  const { data: agents, isStale } = useReactive('agents.findMany', {
    organizationId,
  })
  // ✅ Shows cache instantly
  // ✅ Auto-revalidates (active hook priority)
  // ✅ Switches to real-time automatically
  // ✅ Handles page refresh gracefully

  return (
    <div>
      {isStale && <div className="text-sm text-gray-500">Syncing...</div>}
      {agents?.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}

// Optional: Page-level priority hints for better UX
function AgentsPage() {
  useReactivePriorities([
    'agents.findOne', // User might click on an agent
    'tools.available', // Might open agent tools
    'memory.recent', // Might view agent memory
  ])

  return <AgentList organizationId="org-123" />
}
```

## Key Benefits

| Feature                | Current Approach       | Reactive Library              |
| ---------------------- | ---------------------- | ----------------------------- |
| **Configuration**      | Scattered across files | Single config file            |
| **Cache Management**   | Manual invalidation    | Automatic based on relations  |
| **Type Safety**        | Manual tRPC setup      | Auto-generated from schema    |
| **Client Code**        | Verbose React Query    | One hook for everything       |
| **Real-time**          | Manual WebSocket       | Built-in SSE with zero config |
| **Persistence**        | Manual localStorage    | Configurable per query        |
| **Optimistic Updates** | Manual implementation  | Automatic with config         |
| **Deployment**         | Limited compatibility  | Works on Vercel + Self-hosted |
| **Reconnection**       | Manual implementation  | Automatic browser handling    |
| **Reliability**        | No delivery guarantees | Event acks without heartbeats |

## Success Metrics

### Developer Experience

- **Configuration**: 1 file vs 10+ files
- **Code Reduction**: 80% less boilerplate
- **Type Safety**: 100% automatic
- **Setup Time**: 5 minutes vs 2+ hours

### Performance

- **Cache Hit Rate**: >90% for read operations
- **Invalidation Accuracy**: 100% relevant queries
- **SSE Latency**: <200ms invalidation propagation
- **Bundle Size**: <50KB client-side
- **Connection Efficiency**: Single HTTP stream per organization
- **Vercel Compatibility**: 100% serverless compatible
- **Bandwidth Efficiency**: No wasteful heartbeats, event-driven only

### Reliability

- **Cache Consistency**: Zero stale data bugs
- **Conflict Resolution**: Automatic last-writer-wins
- **Error Recovery**: Automatic retry with exponential backoff
- **Type Safety**: Zero runtime type errors
- **Event Delivery**: 99.9% delivery rate with smart acknowledgments
- **Connection Resilience**: Automatic reconnection without manual intervention

## Open Source Strategy

### Positioning

- **"Convex for any database"** - Reactive features without vendor lock-in
- **"tRPC + reactivity + SSE"** - Enhanced tRPC with real-time caching
- **"Vercel-native reactivity"** - Built for serverless deployment
- **"Configuration over code"** - Define once, reactive everywhere

### Target Audience

- Teams using Drizzle + tRPC
- Developers wanting Convex-like DX
- Companies avoiding vendor lock-in
- Real-time app builders

### Community

- Integration examples (Next.js, Remix, SvelteKit)
- Migration guides from existing solutions
- Performance comparison benchmarks
- Discord community for support

---

This library transforms any Drizzle + tRPC setup into a reactive, real-time system with minimal configuration and zero boilerplate code changes.

## Cursor IDE Integration & AI Assistant Guidelines

### Cursor Rules for @drizzle/reactive

Generate comprehensive Cursor IDE rules to help AI assistants understand and use this library effectively:

```typescript
// .cursorrules for @drizzle/reactive projects
/*
AI Assistant Guidelines for @drizzle/reactive Library Usage

CORE CONCEPTS:
1. Always use defineReactiveFunction() for database operations
2. Explicitly declare dependencies array for cache invalidation
3. Use selective subscriptions (only needed tables)
4. Prefer reactive functions over manual tRPC procedures

FUNCTION DEFINITION PATTERN:
*/
export const functionName = defineReactiveFunction({
  input: z.object({
    /* Zod validation */
  }),
  dependencies: ['table1', 'table2'], // Tables this function reads from
  invalidateWhen: {
    /* Optional fine-grained control */
  },
  handler: async ({ input, db }) => {
    // Database operations here
  },
})

/*
CLIENT USAGE PATTERN:
*/
const { data, isLoading, isStale } = useReactive('operation.name', input)

/*
RELATIONS CONFIGURATION:
- When table X changes, which queries need invalidation?
- Use format: tableName: ['relatedTable.column', 'anotherTable']
- Think: "If this table changes, what cached data becomes outdated?"

COMMON PATTERNS:
1. Agent changes → invalidate messages, memory, organization
2. Organization changes → invalidate all org-scoped data
3. Message changes → invalidate sender/receiver agents

MIGRATION FROM EXISTING CODE:
1. Convert db functions to defineReactiveFunction
2. Replace manual tRPC procedures with createReactiveRouter
3. Replace manual cache invalidation with dependencies array
4. Replace useState/useEffect with useReactive hook

AI ANALYSIS ASSISTANCE:
- Analyze function code to suggest dependencies
- Detect table usage patterns in handlers
- Recommend invalidation strategies
- Generate migration suggestions

PERFORMANCE BEST PRACTICES:
- Use selective subscriptions (page-specific tables)
- Declare minimal dependencies (only what function actually reads)
- Use conditional invalidation for specific records
- Leverage background revalidation for non-critical data

ERROR PATTERNS TO AVOID:
- Missing dependencies (causes stale data)
- Over-broad dependencies (causes unnecessary invalidation)
- Manual cache management (defeats purpose of library)
- Mixing reactive and non-reactive patterns

DEBUGGING TIPS:
- Check isStale flag for cache freshness
- Monitor selective subscriptions in dev tools
- Verify dependencies match actual table usage
- Test invalidation with data mutations
*/
```

### AI Development Assistance Tools

Create tools to help AI assistants work with the library:

```typescript
// AI Assistant Helper Functions
interface LibraryAssistant {
  // Analyze existing function and suggest reactive conversion
  analyzeFunction(code: string): {
    suggestedDependencies: string[]
    detectedTableUsage: TableUsage[]
    migrationSteps: string[]
    potentialIssues: string[]
  }

  // Generate reactive function template
  generateTemplate(description: string): {
    functionCode: string
    explanation: string
    dependencies: string[]
    testSuggestions: string[]
  }

  // Validate relations configuration
  validateRelations(
    relations: Record<string, string[]>,
    schema: DatabaseSchema
  ): {
    isValid: boolean
    suggestions: string[]
    missingRelations: string[]
    overBroadRelations: string[]
  }

  // Suggest optimization opportunities
  analyzePerformance(codebase: string[]): {
    optimizations: OptimizationSuggestion[]
    subscriptionEfficiency: SubscriptionAnalysis
    cacheHitPredictions: CacheAnalysis
  }
}
```

### AI-Powered Migration Assistant

```typescript
// Migration helper for existing codebases
interface MigrationAssistant {
  // Scan codebase and identify conversion opportunities
  scanForReactiveOpportunities(projectPath: string): {
    dbFunctions: DbFunctionAnalysis[]
    trpcProcedures: TrpcProcedureAnalysis[]
    cacheInvalidations: CacheInvalidationPattern[]
    migrationPlan: MigrationStep[]
  }

  // Generate migration code
  generateMigration(analysis: CodeAnalysis): {
    reactiveFunction: string
    routerIntegration: string
    clientUpdates: string[]
    testingStrategy: string[]
  }

  // Validate migration correctness
  validateMigration(
    original: string,
    migrated: string
  ): {
    functionalEquivalence: boolean
    performanceImpact: PerformanceAnalysis
    potentialBreakingChanges: string[]
  }
}
```

### Developer Experience Guidelines

```typescript
// IDE Integration Features
interface IDEIntegration {
  // Auto-completion for reactive functions
  autoComplete: {
    dependenciesArray: string[] // Based on detected table usage
    invalidationPatterns: string[] // Common patterns for table type
    optimizationSuggestions: string[] // Performance recommendations
  }

  // Real-time validation
  linting: {
    missingDependencies: LintRule[]
    unnecessaryDependencies: LintRule[]
    performanceWarnings: LintRule[]
    migrationOpportunities: LintRule[]
  }

  // Debugging assistance
  debugging: {
    cacheStateVisualization: CacheDebugger
    subscriptionTracker: SubscriptionDebugger
    invalidationTracer: InvalidationDebugger
    performanceProfiler: PerformanceDebugger
  }
}
```

### Code Generation Templates

```typescript
// AI-powered code generation
class ReactiveCodeGenerator {
  // Generate reactive function from description
  generateFunction(prompt: string): {
    code: string
    dependencies: string[]
    explanation: string
    examples: string[]
  }

  // Generate test cases
  generateTests(reactiveFunction: ReactiveFunction): {
    unitTests: string[]
    integrationTests: string[]
    cacheTests: string[]
    invalidationTests: string[]
  }

  // Generate documentation
  generateDocs(reactiveFunction: ReactiveFunction): {
    apiDocs: string
    usageExamples: string[]
    performanceNotes: string[]
    migrationGuide: string
  }
}
```

### AI Training Examples

Provide comprehensive examples for AI assistant training:

```typescript
// Example patterns for AI learning
const trainingExamples = {
  // Simple query function
  basic: {
    description: 'Get all agents for an organization',
    before: `
      export async function getAgents(organizationId: string) {
        return db.select().from(agents).where(eq(agents.organizationId, organizationId))
      }
    `,
    after: `
      export const getAgents = defineReactiveFunction({
        input: z.object({ organizationId: z.string() }),
        dependencies: ['agent'],
        handler: async ({ input, db }) => {
          return db.agents.findMany({ where: { organizationId: input.organizationId } })
        }
      })
    `,
    explanation: 'Single table dependency, simple conversion',
  },

  // Complex multi-table function
  complex: {
    description: 'Get agent with related statistics',
    dependencies: ['agent', 'message', 'memory'],
    invalidationStrategy: 'Conditional - only for specific agent',
    performanceNotes: 'Multiple queries, consider batching',
  },

  // Mutation function
  mutation: {
    description: 'Update agent and invalidate related data',
    invalidates: ['agent', 'message', 'memory'],
    optimisticUpdate: true,
    broadcastPattern: 'Organization-scoped',
  },
}
```
