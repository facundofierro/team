/**
 * Test client-side storage and session management
 */

const { ReactiveStorage } = require('./dist/client/storage.js')
const { SessionRecoveryManager } = require('./dist/client/session.js')

// Mock localStorage for Node.js
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  },
  get length() {
    return Object.keys(this.data).length
  },
  key(index) {
    return Object.keys(this.data)[index] || null
  },
}

// Mock document for Node.js
global.document = {
  visibilityState: 'visible',
  addEventListener: () => {},
  removeEventListener: () => {},
}

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
}

async function testClientStorage() {
  console.log('🧪 Testing Client-Side Storage and Session Management\n')

  // Test configuration
  const config = {
    relations: {
      agent: ['message.fromAgentId', 'memory.agentId'],
      message: ['agent.fromAgentId'],
      memory: ['agent.agentId'],
    },
    cache: {
      server: { provider: 'memory' },
      client: { provider: 'localStorage' },
    },
    realtime: {
      enabled: true,
    },
  }

  // Test 1: Storage initialization
  console.log('📦 Test 1: Storage initialization')
  const storage = new ReactiveStorage('org-123')
  const registry = storage.getRegistry()

  console.log(`- Registry created: ${registry !== null ? '✅' : '❌'}`)
  console.log(
    `- Organization ID: ${registry?.organizationId === 'org-123' ? '✅' : '❌'}`
  )
  console.log(`- Session info present: ${registry?.session ? '✅' : '❌'}\n`)

  // Test 2: Query registration
  console.log('📝 Test 2: Query registration')
  storage.registerQuery('agents.getAll', ['agent'], { count: 5 })
  storage.registerQuery('messages.getRecent', ['message'], { count: 10 })

  const updatedRegistry = storage.getRegistry()
  const hasAgentsQuery = updatedRegistry?.queries['agents.getAll'] !== undefined
  const hasMessagesQuery =
    updatedRegistry?.queries['messages.getRecent'] !== undefined

  console.log(`- Agents query registered: ${hasAgentsQuery ? '✅' : '❌'}`)
  console.log(
    `- Messages query registered: ${hasMessagesQuery ? '✅' : '❌'}\n`
  )

  // Test 3: Cache retrieval
  console.log('💾 Test 3: Cache retrieval')
  const agentsCache = storage.getCachedData('agents.getAll')
  const messagesCache = storage.getCachedData('messages.getRecent')

  console.log(`- Agents cache retrieved: ${agentsCache !== null ? '✅' : '❌'}`)
  console.log(
    `- Messages cache retrieved: ${messagesCache !== null ? '✅' : '❌'}`
  )
  console.log(
    `- Agents data correct: ${agentsCache?.data?.count === 5 ? '✅' : '❌'}`
  )
  console.log(
    `- Data not stale initially: ${!agentsCache?.isStale ? '✅' : '❌'}\n`
  )

  // Test 4: Invalidation
  console.log('🔄 Test 4: Query invalidation')
  storage.invalidateQuery('agents.getAll')

  const invalidatedCache = storage.getCachedData('agents.getAll')
  console.log(
    `- Query marked as stale: ${invalidatedCache?.isStale ? '✅' : '❌'}\n`
  )

  // Test 5: Table-based invalidation
  console.log('🔗 Test 5: Table-based invalidation')
  storage.invalidateByTable('agent', config.relations)

  const tableInvalidatedCache = storage.getCachedData('messages.getRecent')
  console.log(
    `- Related queries invalidated: ${
      tableInvalidatedCache?.isStale ? '✅' : '❌'
    }\n`
  )

  // Test 6: Active hooks management
  console.log('🎯 Test 6: Active hooks management')
  storage.registerActiveHook('agents.getAll', ['agent'], 'org-123')
  storage.registerActiveHook('messages.getRecent', ['message'], 'org-123')

  const activeHooks = storage.getActiveHooks()
  const priorityQueries = storage.getPriorityQueries()
  const backgroundQueries = storage.getBackgroundQueries()

  console.log(
    `- Active hooks registered: ${activeHooks.length === 2 ? '✅' : '❌'}`
  )
  console.log(
    `- Priority queries identified: ${
      priorityQueries.length === 2 ? '✅' : '❌'
    }`
  )
  console.log(
    `- Background queries separated: ${
      backgroundQueries.length === 0 ? '✅' : '❌'
    }\n`
  )

  // Test 7: Session gap detection
  console.log('⏰ Test 7: Session gap detection')

  // Simulate time gap by manipulating registry
  const gapRegistry = storage.getRegistry()
  if (gapRegistry) {
    gapRegistry.session.lastSync = Date.now() - 60000 // 1 minute ago
  }

  const gapInfo = storage.detectSessionGap()
  console.log(`- Gap detected: ${gapInfo.hasGap ? '✅' : '❌'}`)
  console.log(
    `- Gap duration reasonable: ${gapInfo.gapDuration > 50000 ? '✅' : '❌'}`
  )
  console.log(
    `- Stale queries identified: ${
      gapInfo.staleQueries.length > 0 ? '✅' : '❌'
    }\n`
  )

  // Test 8: Session recovery manager
  console.log('🚑 Test 8: Session recovery manager')
  const sessionManager = new SessionRecoveryManager(storage, config)
  const analysisInfo = sessionManager.analyzeSessionGap()
  const recoveryPlan = sessionManager.createRecoveryPlan(analysisInfo)

  console.log(
    `- Session analysis completed: ${analysisInfo.hasGap ? '✅' : '❌'}`
  )
  console.log(
    `- Recovery strategy assigned: ${recoveryPlan.strategy ? '✅' : '❌'}`
  )
  console.log(
    `- Priority queries planned: ${
      recoveryPlan.priorityQueries.length > 0 ? '✅' : '❌'
    }\n`
  )

  // Test 9: Real-time status updates
  console.log('📡 Test 9: Real-time status updates')
  storage.updateRealtimeStatus(true)
  const realtimeRegistry = storage.getRegistry()

  console.log(
    `- Real-time status updated: ${
      realtimeRegistry?.session.realtimeConnected ? '✅' : '❌'
    }\n`
  )

  // Test 10: Cleanup and persistence
  console.log('🧹 Test 10: Cleanup and persistence')
  const exportedRegistry = storage.exportRegistry()
  const sessionInfo = storage.getSessionInfo()

  console.log(
    `- Registry exportable: ${exportedRegistry !== null ? '✅' : '❌'}`
  )
  console.log(
    `- Session info accessible: ${sessionInfo !== null ? '✅' : '❌'}`
  )
  console.log(
    `- localStorage data persisted: ${
      Object.keys(localStorage.data).length > 0 ? '✅' : '❌'
    }\n`
  )

  console.log('🎉 Client-side storage tests completed successfully!')
}

// Run the test
testClientStorage().catch(console.error)
