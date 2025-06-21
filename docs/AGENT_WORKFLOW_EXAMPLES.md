# Agent Collaboration Workflows

This document demonstrates complete workflows combining Agent Discovery and A2A Communication tools.

## Workflow 1: Intelligent Task Delegation

**Scenario**: A project manager agent needs to delegate a data analysis task and wants to find the best available data analyst.

### Step 1: Discover Available Data Analysts

```typescript
const discoveryResult = await useAgentDiscovery({
  role: 'analyst',
  capabilities: ['data processing', 'reporting'],
  status: 'active',
  includeMetadata: true,
  sortBy: 'lastActive',
  limit: 10,
})
```

**Discovery Result**:

```json
{
  "success": true,
  "totalFound": 4,
  "agents": [
    {
      "id": "agent-data-analyst-001",
      "name": "Senior Data Analyst",
      "role": "data-analyst",
      "isActive": true,
      "capabilities": ["data processing", "reporting", "machine learning"],
      "toolsAvailable": 12,
      "availability": "available",
      "description": "Senior analyst specializing in customer behavior analysis..."
    },
    {
      "id": "agent-business-analyst-002",
      "name": "Business Intelligence Analyst",
      "role": "business-analyst",
      "isActive": true,
      "capabilities": ["reporting", "analysis", "data processing"],
      "toolsAvailable": 8,
      "availability": "available"
    }
  ],
  "message": "Found 4 agents with role containing \"analyst\" (active only)"
}
```

### Step 2: Apply Selection Logic

```typescript
// Select the agent with the most tools and relevant capabilities
const bestAgent = discoveryResult.agents
  .filter((agent) => agent.availability === 'available')
  .sort((a, b) => (b.toolsAvailable || 0) - (a.toolsAvailable || 0))[0]

console.log(
  `Selected agent: ${bestAgent.name} (${bestAgent.toolsAvailable} tools)`
)
```

### Step 3: Delegate the Task

```typescript
const taskResult = await useAgentToAgent({
  targetAgentId: bestAgent.id,
  messageType: 'task',
  content: `Customer churn analysis needed for Q4 2023 data.

Requirements:
- Analyze customer behavior patterns leading to churn
- Identify top 5 churn indicators
- Recommend retention strategies
- Deliver insights by Friday 2 PM

Dataset: /data/customers/q4-2023/
Priority: High due to board presentation next week

Your capabilities that made you ideal for this task: ${bestAgent.capabilities?.join(
    ', '
  )}`,
  priority: 'high',
  metadata: {
    taskId: 'churn-analysis-q4-2023',
    discoveredVia: 'agentDiscovery',
    selectionCriteria: 'most_tools_available',
    deadline: '2024-01-19T14:00:00Z',
    agentCapabilities: bestAgent.capabilities,
    tags: ['customer-analysis', 'churn', 'urgent'],
  },
})
```

**A2A Result**:

```json
{
  "success": true,
  "messageId": "a2a_1640995200_churn_task",
  "conversationId": "conv_1640995200_analyst_task",
  "targetAgent": {
    "id": "agent-data-analyst-001",
    "name": "Senior Data Analyst",
    "isActive": true
  },
  "deliveryStatus": "delivered",
  "message": "Message successfully delivered to Senior Data Analyst and conversation conv_1640995200_analyst_task created"
}
```

## Workflow 2: Multi-Agent Pipeline Setup

**Scenario**: Setting up a data processing pipeline that requires coordination between multiple specialized agents.

### Step 1: Discover All Required Agent Types

```typescript
// Find data ingestion agents
const ingestionAgents = await useAgentDiscovery({
  capabilities: ['data ingestion', 'api'],
  status: 'active',
  includeMetadata: true,
})

// Find data processors
const processingAgents = await useAgentDiscovery({
  role: 'processor',
  capabilities: ['etl', 'data processing'],
  status: 'active',
  includeMetadata: true,
})

// Find analytics agents
const analyticsAgents = await useAgentDiscovery({
  capabilities: ['analytics', 'machine learning'],
  status: 'active',
  includeMetadata: true,
})

console.log(
  `Pipeline setup: ${ingestionAgents.totalFound} ingestion + ${processingAgents.totalFound} processing + ${analyticsAgents.totalFound} analytics agents`
)
```

### Step 2: Select Best Agent for Each Stage

```typescript
const pipelineAgents = {
  ingestion: ingestionAgents.agents[0], // First available
  processing: processingAgents.agents.find((a) => a.toolsAvailable > 10), // Most capable
  analytics: analyticsAgents.agents.find((a) =>
    a.capabilities?.includes('machine learning')
  ), // ML capable
}
```

### Step 3: Initialize Pipeline

```typescript
// Start with data ingestion
const pipelineStart = await useAgentToAgent({
  targetAgentId: pipelineAgents.ingestion.id,
  messageType: 'workflow',
  content: `Daily data pipeline initialization for 2024-01-15.

Your role: Data Ingestion (Stage 1 of 3)

Tasks:
1. Ingest data from customer APIs
2. Validate data quality and schema
3. Store in staging area: /staging/daily/2024-01-15/
4. Notify processing agent when complete

Next agent in pipeline: ${pipelineAgents.processing.name} (${pipelineAgents.processing.id})

Pipeline workflow ID: daily-pipeline-2024-01-15`,
  priority: 'normal',
  metadata: {
    workflowId: 'daily-pipeline-2024-01-15',
    stage: 'ingestion',
    nextAgentId: pipelineAgents.processing.id,
    finalAgentId: pipelineAgents.analytics.id,
    pipelineSetupBy: 'agentDiscovery',
  },
})
```

## Workflow 3: Emergency Response Team Assembly

**Scenario**: System alert triggered, need to quickly assemble a response team.

### Step 1: Find Emergency Response Agents

```typescript
const emergencyAgents = await useAgentDiscovery({
  searchQuery: 'emergency system critical',
  status: 'active',
  includeMetadata: true,
  sortBy: 'lastActive',
  limit: 20,
})
```

### Step 2: Categorize by Specialization

```typescript
const responseTeam = {
  systemAdmin: emergencyAgents.agents.filter(
    (a) => a.capabilities?.includes('system') || a.role.includes('admin')
  ),
  security: emergencyAgents.agents.filter(
    (a) => a.capabilities?.includes('security') || a.role.includes('security')
  ),
  database: emergencyAgents.agents.filter(
    (a) => a.capabilities?.includes('database') || a.role.includes('database')
  ),
  monitoring: emergencyAgents.agents.filter(
    (a) => a.capabilities?.includes('monitoring') || a.role.includes('monitor')
  ),
}

console.log(
  `Emergency team assembled:`,
  Object.entries(responseTeam)
    .map(([role, agents]) => `${role}: ${agents.length} agents`)
    .join(', ')
)
```

### Step 3: Alert All Team Members

```typescript
const alertMessage = `🚨 CRITICAL SYSTEM ALERT 🚨

Incident: Database cluster performance degradation
Severity: HIGH
Started: 2024-01-15 14:30 UTC
Impact: Customer dashboard timeouts (>30s)

Your expertise needed: Immediate investigation and resolution
Incident ID: INC-2024-001
War room: #incident-response-001

Please acknowledge and provide ETA for investigation.`

// Send alerts to all specialized agents
const alertPromises = Object.entries(responseTeam).flatMap(([role, agents]) =>
  agents.map((agent) =>
    useAgentToAgent({
      targetAgentId: agent.id,
      messageType: 'notification',
      content: `${alertMessage}

Your role in response: ${role.toUpperCase()} specialist
Capabilities matched: ${agent.capabilities?.join(', ')}`,
      priority: 'urgent',
      metadata: {
        incidentId: 'INC-2024-001',
        responseRole: role,
        alertType: 'emergency',
        discoveredVia: 'agentDiscovery',
      },
    })
  )
)

const alertResults = await Promise.all(alertPromises)
console.log(`Sent ${alertResults.length} emergency alerts`)
```

## Workflow 4: Load-Balanced Task Distribution

**Scenario**: Distribute 100 data processing tasks across available agents for optimal performance.

### Step 1: Find All Processing Agents

```typescript
const processingAgents = await useAgentDiscovery({
  capabilities: ['data processing'],
  status: 'active',
  includeMetadata: true,
  sortBy: 'lastActive',
  limit: 50,
})
```

### Step 2: Calculate Load Distribution

```typescript
const totalTasks = 100
const activeAgents = processingAgents.agents.filter(
  (a) => a.availability === 'available'
)
const tasksPerAgent = Math.ceil(totalTasks / activeAgents.length)

console.log(
  `Distributing ${totalTasks} tasks across ${activeAgents.length} agents (${tasksPerAgent} tasks each)`
)
```

### Step 3: Distribute Tasks

```typescript
const taskBatches = Array.from({ length: totalTasks }, (_, i) => ({
  id: `task-${i + 1}`,
  data: `/data/batch/task-${i + 1}.json`,
}))

// Group tasks into batches for each agent
const agentTaskAssignments = activeAgents.map((agent, index) => {
  const startIdx = index * tasksPerAgent
  const endIdx = Math.min(startIdx + tasksPerAgent, totalTasks)
  const assignedTasks = taskBatches.slice(startIdx, endIdx)

  return {
    agent,
    tasks: assignedTasks,
    count: assignedTasks.length,
  }
})

// Send tasks to each agent
const distributionPromises = agentTaskAssignments.map((assignment) =>
  useAgentToAgent({
    targetAgentId: assignment.agent.id,
    messageType: 'task',
    content: `Batch processing assignment: ${assignment.count} tasks

Task details:
${assignment.tasks.map((t) => `- ${t.id}: ${t.data}`).join('\n')}

Processing requirements:
1. Validate input data format
2. Apply transformation rules v2.1
3. Output to /processed/batch/[task-id]/
4. Report completion status

Estimated completion: ${assignment.count * 2} minutes
Load balancing: You received ${assignment.count}/${totalTasks} total tasks`,
    priority: 'normal',
    metadata: {
      batchId: 'batch-processing-2024-01-15',
      taskCount: assignment.count,
      totalTasks: totalTasks,
      discoveredVia: 'agentDiscovery',
      loadBalanced: true,
      estimatedMinutes: assignment.count * 2,
    },
  })
)

const distributionResults = await Promise.all(distributionPromises)
console.log(
  `Successfully distributed tasks to ${
    distributionResults.filter((r) => r.success).length
  } agents`
)
```

## Workflow 5: Knowledge-Based Agent Matching

**Scenario**: Complex research task requiring specific domain expertise.

### Step 1: Search by Multiple Criteria

```typescript
const researchTask = {
  domain: 'machine learning',
  subdomain: 'natural language processing',
  complexity: 'advanced',
  deliverable: 'research paper',
}

// Search for agents with relevant expertise
const mlExperts = await useAgentDiscovery({
  capabilities: ['machine learning', 'research', 'nlp'],
  includeMetadata: true,
  status: 'active',
  limit: 15,
})

// Also search by role
const researchers = await useAgentDiscovery({
  role: 'researcher',
  includeMetadata: true,
  status: 'active',
})
```

### Step 2: Score Agents by Expertise Match

```typescript
const scoredAgents = [...mlExperts.agents, ...researchers.agents]
  .filter(
    (agent, index, self) =>
      // Remove duplicates
      self.findIndex((a) => a.id === agent.id) === index
  )
  .map((agent) => {
    let score = 0
    const prompt = agent.systemPrompt?.toLowerCase() || ''

    // Score based on capability match
    if (agent.capabilities?.includes('machine learning')) score += 30
    if (agent.capabilities?.includes('research')) score += 20
    if (agent.capabilities?.includes('nlp')) score += 25

    // Score based on system prompt keywords
    if (prompt.includes('natural language')) score += 15
    if (prompt.includes('research')) score += 10
    if (prompt.includes('paper')) score += 10
    if (prompt.includes('advanced')) score += 5

    return { ...agent, expertiseScore: score }
  })
  .sort((a, b) => b.expertiseScore - a.expertiseScore)

console.log(
  'Top research candidates:',
  scoredAgents.slice(0, 3).map((a) => `${a.name} (score: ${a.expertiseScore})`)
)
```

### Step 3: Assign to Best Match

```typescript
const topResearcher = scoredAgents[0]

const researchAssignment = await useAgentToAgent({
  targetAgentId: topResearcher.id,
  messageType: 'task',
  content: `Advanced research assignment in NLP/Machine Learning

Research Topic: "Transformer Architecture Improvements for Low-Resource Languages"

Requirements:
- Literature review of recent developments (2023-2024)
- Novel approach proposal with theoretical foundation
- Experimental design and evaluation metrics
- 15-page research paper draft
- Delivery timeline: 3 weeks

Your expertise match score: ${topResearcher.expertiseScore}/100
Selected capabilities: ${topResearcher.capabilities?.join(', ')}

This assignment was matched to you based on:
${topResearcher.systemPrompt?.substring(0, 200)}...

Resources provided: Access to academic databases, computation cluster`,
  priority: 'normal',
  metadata: {
    taskId: 'research-transformer-lowresource',
    domain: 'machine-learning',
    subdomain: 'nlp',
    expertiseScore: topResearcher.expertiseScore,
    selectionMethod: 'capability-scoring',
    discoveredVia: 'agentDiscovery',
    estimatedWeeks: 3,
  },
})
```

## Best Practices Summary

### 1. **Always Discover Before Communicating**

```typescript
// ❌ Don't hardcode agent IDs
await useAgentToAgent({ targetAgentId: "agent-123", ... })

// ✅ Discover agents dynamically
const agents = await useAgentDiscovery({ role: "analyst" })
await useAgentToAgent({ targetAgentId: agents.agents[0].id, ... })
```

### 2. **Use Metadata to Track Discovery Context**

```typescript
await useAgentToAgent({
  // ... other params
  metadata: {
    discoveredVia: 'agentDiscovery',
    selectionCriteria: 'most_tools_available',
    agentCapabilities: selectedAgent.capabilities,
    discoveryTimestamp: new Date().toISOString(),
  },
})
```

### 3. **Implement Fallback Strategies**

```typescript
let agents = await useAgentDiscovery({ capabilities: ['specific-skill'] })

if (agents.totalFound === 0) {
  // Fallback to broader search
  agents = await useAgentDiscovery({
    role: 'general-assistant',
    status: 'active',
  })
}

if (agents.totalFound === 0) {
  // Final fallback or error handling
  throw new Error('No suitable agents available')
}
```

### 4. **Cache Discovery Results When Appropriate**

```typescript
// Cache for workflows that need multiple communications
const dataAnalysts = await useAgentDiscovery({ role: "analyst" })

// Use cached results for multiple tasks
for (const task of tasks) {
  const selectedAgent = selectAgentForTask(dataAnalysts.agents, task)
  await useAgentToAgent({ targetAgentId: selectedAgent.id, ... })
}
```

These workflows demonstrate the power of combining Agent Discovery with A2A Communication to create intelligent, adaptive agent collaboration patterns.
