# Agent Discovery Tool

## Overview

The Agent Discovery Tool enables agents to search and discover other agents within their organization. This tool is essential for understanding who is available for collaboration and communication before using the A2A communication system.

## Key Features

### 🔍 **Search Capabilities**

- **Name Search**: Find agents by their display names
- **Role-based Search**: Filter by agent roles and functions
- **Capability Search**: Find agents with specific skills or tools
- **Status Filtering**: Filter by active, inactive, or all agents

### 📊 **Advanced Filtering**

- **Multiple Criteria**: Combine search terms, roles, and capabilities
- **Sorting Options**: Sort by name, role, creation date, or last activity
- **Result Limiting**: Control the number of results returned
- **Metadata Control**: Choose basic info or detailed agent metadata

### 🔒 **Security & Permissions**

- **Organization Scoped**: Only discover agents within the same organization
- **Future Permission Support**: Ready for granular discovery permissions
- **Active Status Validation**: Clearly indicates which agents are available

## Tool Configuration

```typescript
{
  id: 'agentDiscovery',
  type: 'agentDiscovery',
  canBeManaged: false, // Internal tool
  managedPrice: 0,
  allowedUsage: 10000, // High limit for discovery
  configurationParams: {} // No external config needed
}
```

## Usage Examples

### Example 1: Basic Agent Search

```json
{
  "searchQuery": "data",
  "status": "active",
  "limit": 10
}
```

**Result:**

```json
{
  "success": true,
  "totalFound": 3,
  "agents": [
    {
      "id": "agent-data-analyst-001",
      "name": "Data Analysis Specialist",
      "role": "data-analyst",
      "isActive": true
    },
    {
      "id": "agent-data-processor-002",
      "name": "ETL Data Processor",
      "role": "data-engineer",
      "isActive": true
    },
    {
      "id": "agent-database-admin-003",
      "name": "Database Administrator",
      "role": "database-admin",
      "isActive": true
    }
  ],
  "searchQuery": "data",
  "filters": {
    "status": "active"
  },
  "message": "Found 3 agents matching \"data\" (active only)"
}
```

### Example 2: Role-Specific Search

```json
{
  "role": "analyst",
  "status": "active",
  "includeMetadata": true,
  "sortBy": "name",
  "sortOrder": "asc"
}
```

**Result:**

```json
{
  "success": true,
  "totalFound": 5,
  "agents": [
    {
      "id": "agent-business-analyst-001",
      "name": "Business Intelligence Analyst",
      "role": "business-analyst",
      "isActive": true,
      "systemPrompt": "Specialized in business intelligence, KPI analysis, and strategic insights...",
      "capabilities": ["analysis", "reporting", "data processing"],
      "toolsAvailable": 8,
      "maxInstances": 1,
      "createdAt": "2024-01-10T09:30:00Z",
      "description": "business-analyst - Specialized in business intelligence, KPI analysis, and strategic insights...",
      "tags": ["business-analyst", "analysis", "reporting", "data processing"],
      "availability": "available"
    },
    {
      "id": "agent-data-analyst-002",
      "name": "Customer Data Analyst",
      "role": "data-analyst",
      "isActive": true,
      "systemPrompt": "Expert in customer behavior analysis, segmentation, and predictive modeling...",
      "capabilities": ["analysis", "machine learning", "data processing"],
      "toolsAvailable": 12,
      "maxInstances": 2,
      "createdAt": "2024-01-08T14:15:00Z",
      "description": "data-analyst - Expert in customer behavior analysis, segmentation, and predictive modeling...",
      "tags": [
        "data-analyst",
        "analysis",
        "machine learning",
        "data processing"
      ],
      "availability": "available"
    }
  ],
  "filters": {
    "role": "analyst",
    "status": "active"
  },
  "message": "Found 5 agents with role containing \"analyst\" (active only)"
}
```

### Example 3: Capability-Based Discovery

```json
{
  "capabilities": ["machine learning", "api"],
  "status": "active",
  "includeMetadata": true,
  "limit": 5
}
```

**Result:**

```json
{
  "success": true,
  "totalFound": 2,
  "agents": [
    {
      "id": "agent-ml-specialist-001",
      "name": "ML Research Specialist",
      "role": "ml-engineer",
      "isActive": true,
      "systemPrompt": "Advanced machine learning specialist focusing on deep learning, API integration...",
      "capabilities": ["machine learning", "ai", "api", "research"],
      "toolsAvailable": 15,
      "availability": "available"
    },
    {
      "id": "agent-api-developer-002",
      "name": "API Integration Expert",
      "role": "backend-developer",
      "isActive": true,
      "systemPrompt": "Backend developer specializing in API design, machine learning model deployment...",
      "capabilities": ["api", "machine learning", "coding"],
      "toolsAvailable": 10,
      "availability": "available"
    }
  ],
  "filters": {
    "status": "active",
    "capabilities": ["machine learning", "api"]
  },
  "message": "Found 2 agents (active only)"
}
```

### Example 4: Comprehensive Team Overview

```json
{
  "status": "all",
  "includeMetadata": true,
  "sortBy": "role",
  "sortOrder": "asc",
  "limit": 50
}
```

**Use Case**: Get a complete overview of all agents in the organization for team planning.

### Example 5: Find Specific Agent Type

```json
{
  "searchQuery": "monitoring security",
  "status": "active",
  "includeMetadata": false
}
```

**Use Case**: Quickly find agents responsible for monitoring and security tasks.

## Integration with A2A Communication

The typical workflow combines both tools:

### Step 1: Discover Available Agents

```typescript
// First, discover agents with specific capabilities
const discoveryResult = await useAgentDiscovery({
  capabilities: ['database', 'performance'],
  status: 'active',
  includeMetadata: true,
})

console.log(`Found ${discoveryResult.totalFound} database experts`)
```

### Step 2: Select and Communicate

```typescript
// Select the most suitable agent and send a task
if (discoveryResult.success && discoveryResult.agents.length > 0) {
  const bestAgent = discoveryResult.agents[0] // Or apply selection logic

  const communicationResult = await useAgentToAgent({
    targetAgentId: bestAgent.id,
    messageType: 'task',
    content: `Database performance issue needs investigation. Agent capabilities: ${bestAgent.capabilities?.join(
      ', '
    )}`,
    priority: 'high',
    metadata: {
      taskId: 'perf-investigation-001',
      discoveredVia: 'agentDiscovery',
      agentCapabilities: bestAgent.capabilities,
    },
  })
}
```

## Parameter Reference

### Search Parameters

| Parameter         | Type                                            | Default    | Description                                |
| ----------------- | ----------------------------------------------- | ---------- | ------------------------------------------ |
| `searchQuery`     | string                                          | -          | Search term for name, role, or description |
| `role`            | string                                          | -          | Filter by specific role                    |
| `status`          | `'active' \| 'inactive' \| 'all'`               | `'active'` | Agent status filter                        |
| `capabilities`    | string[]                                        | `[]`       | Filter by capabilities/skills              |
| `limit`           | number                                          | `20`       | Maximum results (1-100)                    |
| `sortBy`          | `'name' \| 'role' \| 'created' \| 'lastActive'` | `'name'`   | Sort criteria                              |
| `sortOrder`       | `'asc' \| 'desc'`                               | `'asc'`    | Sort direction                             |
| `includeMetadata` | boolean                                         | `false`    | Include detailed agent information         |

### Result Structure

```typescript
type AgentDiscoveryResult = {
  success: boolean
  totalFound: number
  agents: AgentInfo[]
  searchQuery?: string
  filters: {
    role?: string
    status?: string
    capabilities?: string[]
  }
  message: string
}

type AgentInfo = {
  id: string
  name: string
  role: string
  isActive: boolean
  // Optional metadata (when includeMetadata: true)
  systemPrompt?: string
  capabilities?: string[]
  toolsAvailable?: number
  maxInstances?: number
  createdAt?: string
  description?: string
  tags?: string[]
  availability?: 'available' | 'busy' | 'offline'
}
```

## Common Use Cases

### 1. **Task Delegation Preparation**

Find agents with specific skills before delegating tasks:

```json
{ "capabilities": ["data-analysis", "reporting"], "status": "active" }
```

### 2. **Team Coordination**

Discover all agents in a project team:

```json
{ "searchQuery": "project-alpha", "includeMetadata": true }
```

### 3. **Load Balancing**

Find available agents for workload distribution:

```json
{ "role": "processor", "status": "active", "sortBy": "lastActive" }
```

### 4. **Capability Mapping**

Understand organizational capabilities:

```json
{ "status": "all", "includeMetadata": true, "limit": 100 }
```

### 5. **Emergency Response**

Quickly find critical system agents:

```json
{ "searchQuery": "emergency critical system", "status": "active" }
```

## Future Enhancements

### Phase 2: Advanced Discovery

- **Real-time Availability**: Live status updates (busy, available, offline)
- **Workload Indicators**: Current task count and capacity
- **Performance Metrics**: Success rates, response times
- **Specialization Scores**: Skill proficiency ratings

### Phase 3: Permission System

- **Discovery Permissions**: Control who can discover which agents
- **Visibility Levels**: Public, team-only, or private agents
- **Role-based Access**: Different discovery rights based on agent roles
- **Audit Logging**: Track who discovers and contacts whom

### Phase 4: Intelligent Recommendations

- **Best Match Suggestions**: AI-powered agent recommendations
- **Historical Success**: Recommend based on past successful collaborations
- **Context Awareness**: Suggest agents based on current conversation context
- **Dynamic Routing**: Automatic agent selection for workflows

## Security Considerations

- ✅ **Organization Isolation**: Agents only discover peers in same organization
- ✅ **Status Validation**: Clear indication of agent availability
- ✅ **Metadata Protection**: Sensitive information controlled via `includeMetadata` flag
- ✅ **Rate Limiting**: High usage limits prevent discovery abuse
- 🔄 **Future Permission System**: Framework ready for fine-grained access control

## Best Practices

### 1. **Efficient Searching**

- Use specific `capabilities` rather than broad `searchQuery`
- Filter by `status: "active"` to avoid inactive agents
- Set appropriate `limit` to avoid overwhelming results

### 2. **Metadata Usage**

- Use `includeMetadata: false` for quick lookups
- Enable `includeMetadata: true` only when detailed info is needed
- Cache discovery results to reduce repeated searches

### 3. **Workflow Integration**

- Always discover before communicating with unknown agents
- Validate agent capabilities match task requirements
- Include discovery context in A2A communication metadata

### 4. **Error Handling**

- Check `success` field before processing results
- Handle empty results gracefully
- Implement fallback strategies for failed discoveries

The Agent Discovery Tool provides the foundation for intelligent agent collaboration, enabling agents to find the right teammates for any task or workflow within the TeamHub ecosystem.
