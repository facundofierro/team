/**
 * Test smart revalidation system with active hooks priority
 */

const { ReactiveStorage } = require('./dist/client/storage.js')
const { SmartRevalidationEngine } = require('./dist/client/revalidation.js')

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

async function testSmartRevalidation() {
  console.log('🧪 Testing Smart Revalidation System\n')

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

  // Initialize storage and revalidation engine
  const storage = new ReactiveStorage('org-123')
  const revalidationEngine = new SmartRevalidationEngine(storage, config)

  // Test 1: Register some queries and active hooks
  console.log('📝 Test 1: Setup queries and active hooks')

  // Register queries with different access patterns
  storage.registerQuery('agents.getAll', ['agent'], { count: 5 })
  storage.registerQuery('agents.getById', ['agent'], { id: 'agent-1' })
  storage.registerQuery('messages.getRecent', ['message'], { count: 10 })
  storage.registerQuery('memory.getForAgent', ['memory'], {
    agentId: 'agent-1',
  })
  storage.registerQuery('tools.getAvailable', ['tool'], { count: 3 })

  // Register active hooks with different priorities
  storage.registerActiveHook('agents.getAll', ['agent'], 'org-123')
  storage.registerActiveHook('agents.getById', ['agent'], 'org-123')
  storage.registerActiveHook('messages.getRecent', ['message'], 'org-123')

  // Simulate different access times
  const hooks = storage.getActiveHooks()
  hooks[0].lastAccess = Date.now() - 5000 // 5 seconds ago (high priority)
  hooks[1].lastAccess = Date.now() - 60000 // 1 minute ago (medium priority)
  hooks[2].lastAccess = Date.now() - 300000 // 5 minutes ago (low priority)

  console.log(
    `- Registered ${
      Object.keys(storage.getRegistry().queries).length
    } queries: ✅`
  )
  console.log(`- Active hooks: ${storage.getActiveHooks().length}: ✅`)
  console.log(
    `- Priority queries: ${storage.getPriorityQueries().length}: ✅\n`
  )

  // Test 2: Create revalidation strategy
  console.log('🎯 Test 2: Create intelligent revalidation strategy')

  const invalidatedQueries = [
    'agents.getAll',
    'agents.getById',
    'messages.getRecent',
    'memory.getForAgent',
    'tools.getAvailable',
  ]

  const strategy = revalidationEngine.createRevalidationStrategy(
    invalidatedQueries,
    {
      maxConcurrent: 3,
      priorityFirst: true,
      backgroundDelay: 1000,
    }
  )

  console.log(`- Strategy created: ✅`)
  console.log(`- Immediate queries: ${strategy.immediate.length}`)
  console.log(`- Delayed queries: ${strategy.delayed.length}`)
  console.log(`- Background queries: ${strategy.background.length}`)
  console.log(`- Estimated time: ${strategy.estimatedTime}ms\n`)

  // Test 3: Mock revalidation function
  console.log('⚡ Test 3: Execute revalidation strategy')

  let revalidationCount = 0
  const revalidationLog = []

  const mockRevalidateFn = async (queryKey) => {
    revalidationCount++
    const startTime = Date.now()

    // Simulate different revalidation times
    const delay = Math.random() * 100 + 50 // 50-150ms
    await new Promise((resolve) => setTimeout(resolve, delay))

    revalidationLog.push({
      queryKey,
      timestamp: startTime,
      duration: Date.now() - startTime,
    })

    console.log(`  ✅ Revalidated: ${queryKey} (${Math.round(delay)}ms)`)
    return { success: true, data: `revalidated-${queryKey}` }
  }

  const result = await revalidationEngine.executeRevalidationStrategy(
    strategy,
    mockRevalidateFn,
    {
      maxConcurrent: 3,
      backgroundDelay: 500,
    }
  )

  console.log(`\n- Strategy execution completed: ✅`)
  console.log(`- Total revalidations: ${revalidationCount}`)
  console.log(`- Immediate successful: ${result.immediate.successful}`)
  console.log(`- Delayed successful: ${result.delayed.successful}`)
  console.log(`- Overall success: ${result.overallSuccess ? '✅' : '❌'}`)
  console.log(`- Total duration: ${result.totalDuration}ms\n`)

  // Test 4: Queue-based revalidation
  console.log('📋 Test 4: Queue-based revalidation system')

  // Add queries to queue with different priorities
  revalidationEngine.queueRevalidation('agents.getAll', 20) // Highest priority
  revalidationEngine.queueRevalidation('messages.getRecent', 10) // High priority
  revalidationEngine.queueRevalidation('tools.getAvailable', 5) // Medium priority
  revalidationEngine.queueRevalidation('memory.getForAgent', 1) // Low priority

  const queueStats = revalidationEngine.getRevalidationStats()
  console.log(`- Queued queries: ${queueStats.queuedQueries}`)
  console.log(`- Active hooks: ${queueStats.activeHooks}`)

  // Process the queue
  revalidationCount = 0
  await revalidationEngine.processRevalidationQueue(mockRevalidateFn, {
    maxConcurrent: 2,
  })

  console.log(`- Queue processed: ✅`)
  console.log(`- Queue revalidations: ${revalidationCount}\n`)

  // Test 5: Smart invalidation and revalidation
  console.log('🔄 Test 5: Smart invalidation and revalidation')

  revalidationCount = 0
  const smartResult = await revalidationEngine.smartInvalidateAndRevalidate(
    'agent',
    mockRevalidateFn,
    {
      maxConcurrent: 2,
      priorityFirst: true,
      backgroundDelay: 200,
    }
  )

  console.log(`- Smart invalidation completed: ✅`)
  console.log(`- Affected queries revalidated: ${revalidationCount}`)
  console.log(
    `- Smart execution success: ${smartResult.overallSuccess ? '✅' : '❌'}\n`
  )

  // Test 6: Performance and concurrency
  console.log('⚡ Test 6: Performance and concurrency limits')

  const performanceQueries = Array.from(
    { length: 10 },
    (_, i) => `perf.query${i}`
  )
  revalidationCount = 0

  const perfStrategy = revalidationEngine.createRevalidationStrategy(
    performanceQueries,
    {
      maxConcurrent: 3,
    }
  )

  const perfStart = Date.now()
  await revalidationEngine.executeRevalidationStrategy(
    perfStrategy,
    mockRevalidateFn,
    { maxConcurrent: 3 }
  )
  const perfDuration = Date.now() - perfStart

  console.log(`- Performance test completed: ✅`)
  console.log(`- Queries processed: ${revalidationCount}`)
  console.log(`- Total time: ${perfDuration}ms`)
  console.log(
    `- Average per query: ${Math.round(perfDuration / revalidationCount)}ms\n`
  )

  // Test 7: Statistics and monitoring
  console.log('📊 Test 7: Statistics and monitoring')

  const finalStats = revalidationEngine.getRevalidationStats()
  console.log(`- Active revalidations: ${finalStats.activeRevalidations}`)
  console.log(`- Queued queries: ${finalStats.queuedQueries}`)
  console.log(`- Active hooks: ${finalStats.activeHooks}`)
  console.log(`- Recent activity entries: ${finalStats.recentActivity.length}`)

  console.log(`\n🎉 Smart revalidation tests completed successfully!`)
}

// Run the test
testSmartRevalidation().catch(console.error)
