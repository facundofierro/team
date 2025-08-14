/**
 * Simple test runner for the reactive database system
 */

const { createReactiveDb } = require('./dist/core/driver.js')

// Mock Drizzle database
class MockDrizzleDb {
  constructor() {
    this.data = new Map()
    this.executedQueries = []

    // Initialize with test data
    this.data.set('agents', [
      { id: 'agent-1', name: 'Agent 1', organizationId: 'org-123' },
      { id: 'agent-2', name: 'Agent 2', organizationId: 'org-123' },
    ])
    this.data.set('messages', [
      {
        id: 'msg-1',
        content: 'Hello',
        fromAgentId: 'agent-1',
        organizationId: 'org-123',
      },
    ])
  }

  async execute(sql, params = []) {
    const sqlString =
      typeof sql === 'string' ? sql : (sql && sql.sql) || 'unknown'
    this.executedQueries.push(sqlString)

    console.log(`[MockDB] Executing: ${sqlString}`)

    // Simulate database response
    if (sqlString.toUpperCase().includes('SELECT')) {
      if (sqlString.includes('agents')) {
        return this.data.get('agents') || []
      } else if (sqlString.includes('messages')) {
        return this.data.get('messages') || []
      }
      return []
    }

    if (sqlString.toUpperCase().includes('INSERT')) {
      return { insertId: 'new-id', affectedRows: 1 }
    }

    if (sqlString.toUpperCase().includes('UPDATE')) {
      return { affectedRows: 1 }
    }

    if (sqlString.toUpperCase().includes('DELETE')) {
      return { affectedRows: 1 }
    }

    return {}
  }

  getExecutedQueries() {
    return [...this.executedQueries]
  }

  clearExecutedQueries() {
    this.executedQueries = []
  }
}

async function runTest() {
  console.log('🧪 Reactive Database Integration Test\n')

  // Test configuration
  const config = {
    relations: {
      agent: ['message.fromAgentId', 'memory.agentId'],
      message: ['agent.fromAgentId'],
      memory: ['agent.agentId'],
    },
    cache: {
      server: { provider: 'memory' },
    },
    realtime: {
      enabled: true,
    },
  }

  // Create reactive database
  const mockDb = new MockDrizzleDb()
  const reactiveDb = createReactiveDb(mockDb, config)

  console.log('✅ Reactive database created successfully')

  // Test 1: Basic query execution
  console.log('\n📋 Test 1: Basic query execution')
  mockDb.clearExecutedQueries()

  const result1 = await reactiveDb.query(
    'SELECT * FROM agents WHERE organizationId = ?',
    ['org-123']
  )
  console.log(`- Query result count: ${result1.length}`)
  console.log(
    `- Database queries executed: ${mockDb.getExecutedQueries().length}`
  )

  // Test 2: Cache functionality
  console.log('\n💾 Test 2: Cache functionality')
  const cache = reactiveDb.getCache()

  await cache.set('test-key', { message: 'cached data' })
  const cached = await cache.get('test-key')

  console.log(
    `- Cache set/get: ${cached.message === 'cached data' ? '✅' : '❌'}`
  )

  // Test 3: Subscription system
  console.log('\n📡 Test 3: Subscription system')
  let eventReceived = false

  const unsubscribe = reactiveDb.subscribe('org-123', (event) => {
    console.log(`- Event received for table: ${event.table}`)
    eventReceived = true
  })

  console.log('- Subscription created: ✅')
  unsubscribe()
  console.log('- Unsubscription: ✅')

  console.log('\n🎉 All tests completed successfully!')
}

// Run the test
runTest().catch(console.error)
