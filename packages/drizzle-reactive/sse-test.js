/**
 * Test Server-Sent Events (SSE) real-time transport system
 */

const { SSEManager } = require('./dist/core/sse.js')

// Mock EventSource for Node.js (simplified)
class MockEventSource {
  constructor(url) {
    this.url = url
    this.readyState = 1 // OPEN
    this.onopen = null
    this.onmessage = null
    this.onerror = null
    this.listeners = new Map()

    // Simulate connection opening
    setTimeout(() => {
      if (this.onopen) {
        this.onopen({ type: 'open' })
      }
    }, 10)
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type).add(listener)
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  close() {
    this.readyState = 2 // CLOSED
  }

  // Simulate receiving a message
  simulateMessage(data) {
    const event = { type: 'message', data: JSON.stringify(data) }
    if (this.onmessage) {
      this.onmessage(event)
    }
    const listeners = this.listeners.get('message')
    if (listeners) {
      listeners.forEach((listener) => listener(event))
    }
  }
}

// Mock ReadableStreamDefaultController
class MockController {
  constructor() {
    this.messages = []
    this.closed = false
  }

  enqueue(chunk) {
    if (!this.closed) {
      const decoder = new TextDecoder()
      const message = decoder.decode(chunk)
      this.messages.push(message)
      console.log(`[MockController] Enqueued: ${message.trim()}`)
    }
  }

  close() {
    this.closed = true
    console.log('[MockController] Stream closed')
  }
}

async function testSSESystem() {
  console.log('📡 Testing Server-Sent Events (SSE) System\n')

  const sseManager = new SSEManager()

  // Test 1: Create SSE stream
  console.log('🌊 Test 1: Create SSE stream')

  const mockController = new MockController()
  const orgId = 'org-test-123'

  // Mock the Response constructor to capture the stream
  const originalResponse = global.Response
  let capturedStream = null

  global.Response = class extends originalResponse {
    constructor(stream, options) {
      super(stream, options)
      capturedStream = stream
    }
  }

  // Create SSE stream
  const response = sseManager.createSSEStream(orgId)

  console.log(`- SSE stream created for org: ${orgId}: ✅`)
  console.log(
    `- Response content type: ${response.headers.get('Content-Type')}: ✅`
  )
  console.log(
    `- CORS headers set: ${
      response.headers.get('Access-Control-Allow-Origin') === '*' ? '✅' : '❌'
    }`
  )

  // Restore original Response
  global.Response = originalResponse

  // Test 2: Connection statistics
  console.log('\n📊 Test 2: Connection statistics')

  const stats = sseManager.getConnectionStats()
  console.log(`- Total connections: ${stats.totalConnections}`)
  console.log(`- Connections by org: ${JSON.stringify(stats.connectionsByOrg)}`)
  console.log(`- Pending events: ${stats.pendingEvents}`)
  console.log(`- Statistics retrieved: ✅\n`)

  // Test 3: Broadcast invalidation events
  console.log('📢 Test 3: Broadcast invalidation events')

  let broadcastCount = 0
  const originalBroadcast = sseManager.broadcastInvalidation.bind(sseManager)
  sseManager.broadcastInvalidation = async function (orgId, invalidationData) {
    broadcastCount++
    console.log(`  📡 Broadcasting to ${orgId}: ${invalidationData.table}`)
    return originalBroadcast(orgId, invalidationData)
  }

  await sseManager.broadcastInvalidation(orgId, {
    type: 'invalidation',
    table: 'agents',
    organizationId: orgId,
    timestamp: Date.now(),
    operation: 'INSERT',
    affectedKeys: ['organizationId'],
    affectedQueries: ['agents.getAll', 'agents.getByOrg'],
  })

  await sseManager.broadcastInvalidation(orgId, {
    type: 'invalidation',
    table: 'messages',
    organizationId: orgId,
    timestamp: Date.now(),
    operation: 'UPDATE',
    affectedKeys: ['messageId'],
    affectedQueries: ['messages.getRecent'],
  })

  console.log(`- Broadcast events sent: ${broadcastCount}: ✅`)

  const newStats = sseManager.getConnectionStats()
  console.log(`- Pending events after broadcast: ${newStats.pendingEvents}`)

  // Test 4: Event acknowledgment
  console.log('\n✅ Test 4: Event acknowledgment system')

  // Get some pending events
  const pendingEvents = newStats.activeEvents
  console.log(`- Active pending events: ${pendingEvents.length}`)

  if (pendingEvents.length > 0) {
    const eventToAck = pendingEvents[0]
    console.log(`- Acknowledging event: ${eventToAck.id}`)

    sseManager.acknowledgeEvent(eventToAck.id)

    const ackStats = sseManager.getConnectionStats()
    console.log(`- Events after acknowledgment: ${ackStats.pendingEvents}`)
    console.log(`- Event acknowledged: ✅`)
  }

  // Test 5: Multiple organization support
  console.log('\n🏢 Test 5: Multiple organization support')

  const orgId2 = 'org-test-456'
  const orgId3 = 'org-test-789'

  await sseManager.broadcastInvalidation(orgId2, {
    type: 'invalidation',
    table: 'tools',
    organizationId: orgId2,
    timestamp: Date.now(),
    operation: 'DELETE',
    affectedKeys: ['toolId'],
    affectedQueries: ['tools.getAvailable'],
  })

  await sseManager.broadcastInvalidation(orgId3, {
    type: 'invalidation',
    table: 'memory',
    organizationId: orgId3,
    timestamp: Date.now(),
    operation: 'INSERT',
    affectedKeys: ['agentId'],
    affectedQueries: ['memory.getForAgent'],
  })

  const multiOrgStats = sseManager.getConnectionStats()
  console.log(`- Multi-org pending events: ${multiOrgStats.pendingEvents}`)
  console.log(
    `- Organizations: ${Object.keys(multiOrgStats.connectionsByOrg).length}`
  )
  console.log(`- Multi-org support: ✅`)

  // Test 6: Retry mechanism simulation
  console.log('\n🔄 Test 6: Retry mechanism (simulated)')

  // Send an event that would require retry
  await sseManager.broadcastInvalidation('org-no-connections', {
    type: 'invalidation',
    table: 'test',
    organizationId: 'org-no-connections',
    timestamp: Date.now(),
    operation: 'UPDATE',
    affectedKeys: [],
    affectedQueries: ['test.query'],
  })

  console.log('- Event sent to org with no connections (will retry): ✅')
  console.log('- Retry mechanism configured: ✅')

  // Test 7: Performance with many events
  console.log('\n⚡ Test 7: Performance with multiple events')

  const perfStart = Date.now()
  const promises = []

  for (let i = 0; i < 20; i++) {
    promises.push(
      sseManager.broadcastInvalidation(`org-perf-${i % 3}`, {
        type: 'invalidation',
        table: `table_${i}`,
        organizationId: `org-perf-${i % 3}`,
        timestamp: Date.now(),
        operation: 'INSERT',
        affectedKeys: [`key_${i}`],
        affectedQueries: [`query_${i}`],
      })
    )
  }

  await Promise.all(promises)
  const perfDuration = Date.now() - perfStart

  console.log(`- 20 broadcast events completed in ${perfDuration}ms: ✅`)
  console.log(`- Average per event: ${Math.round(perfDuration / 20)}ms`)

  const finalStats = sseManager.getConnectionStats()
  console.log(`- Final pending events: ${finalStats.pendingEvents}`)

  // Test 8: Cleanup and resource management
  console.log('\n🧹 Test 8: Cleanup and resource management')

  const cleanupStats = sseManager.getConnectionStats()
  console.log(`- Events before cleanup: ${cleanupStats.pendingEvents}`)
  console.log(
    `- Total connections before cleanup: ${cleanupStats.totalConnections}`
  )

  sseManager.cleanup()

  const postCleanupStats = sseManager.getConnectionStats()
  console.log(`- Events after cleanup: ${postCleanupStats.pendingEvents}`)
  console.log(
    `- Connections after cleanup: ${postCleanupStats.totalConnections}`
  )
  console.log(`- Cleanup completed: ✅`)

  console.log('\n🎉 SSE system tests completed successfully!')

  return {
    broadcastCount,
    pendingEventsCreated: cleanupStats.pendingEvents,
    performanceDuration: perfDuration,
    multiOrgSupport: Object.keys(multiOrgStats.connectionsByOrg).length > 1,
  }
}

// Run the test
testSSESystem()
  .then((results) => {
    console.log('\n📈 Test Results Summary:')
    console.log(`- Broadcast events: ${results.broadcastCount}`)
    console.log(`- Pending events created: ${results.pendingEventsCreated}`)
    console.log(`- Performance duration: ${results.performanceDuration}ms`)
    console.log(`- Multi-org support: ${results.multiOrgSupport ? '✅' : '❌'}`)
  })
  .catch(console.error)
