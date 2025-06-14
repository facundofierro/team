# Agent-to-Agent (A2A) Communication System

## Overview

The Agent-to-Agent (A2A) Communication System is a powerful tool that enables agents within TeamHub organizations to communicate, delegate tasks, and execute complex workflows. This system is implemented as an internal tool rather than network communication, ensuring security, consistency, and seamless integration with the existing TeamHub architecture.

## Key Features

### 1. **Multi-Modal Communication**

- **Task Delegation**: Send specific tasks to other agents
- **Workflow Orchestration**: Coordinate multi-agent workflows
- **Request-Response**: Ask for information or assistance
- **Notifications**: Send status updates and alerts
- **Responses**: Reply to previous messages or tasks

### 2. **Scheduling & Timing**

- **Immediate Delivery**: Send messages instantly
- **Scheduled Delivery**: Schedule messages for future execution
- **Message Expiration**: Set expiration times for time-sensitive communications

### 3. **Priority Management**

- **Priority Levels**: `low`, `normal`, `high`, `urgent`
- **Intelligent Routing**: Higher priority messages get precedence
- **Context Preservation**: Priority context maintained throughout workflows

### 4. **Conversation Integration**

- **Automatic Conversations**: Creates new conversations for task-based communications
- **Memory Integration**: Leverages TeamHub's memory system for context
- **Audit Trail**: Complete logging of all agent interactions

## Usage Scenarios

### Scenario 1: Simple Task Delegation

```json
{
  "targetAgentId": "agent-research-specialist",
  "messageType": "task",
  "content": "Please research the latest trends in AI agent architectures and prepare a summary report",
  "priority": "normal",
  "metadata": {
    "taskId": "research-001",
    "tags": ["research", "ai", "architecture"],
    "expiresAt": "2024-01-15T18:00:00Z"
  }
}
```

**What happens:**

1. ✅ Target agent is validated and checked for active status
2. 💬 A new conversation is created for the research specialist
3. 📝 The conversation starts with a formatted task description
4. 🔔 The research specialist receives the task in their chat interface
5. 📊 An audit trail is created in the messages table

### Scenario 2: Multi-Agent Workflow

```json
{
  "targetAgentId": "agent-data-processor",
  "messageType": "workflow",
  "content": "Process the customer feedback data and pass cleaned results to the analysis team",
  "priority": "high",
  "metadata": {
    "workflowId": "customer-feedback-pipeline",
    "taskId": "data-processing-step",
    "tags": ["data-processing", "customer-feedback"]
  }
}
```

**Workflow continuation:**
The data processor agent, upon completion, can send results to the next agent:

```json
{
  "targetAgentId": "agent-data-analyst",
  "messageType": "workflow",
  "content": "Data processing complete. Cleaned dataset attached. Please perform sentiment analysis.",
  "priority": "high",
  "metadata": {
    "workflowId": "customer-feedback-pipeline",
    "responseToMessageId": "a2a_1640995200_abc123",
    "attachments": [
      {
        "type": "dataset",
        "data": { "rows": 1500, "columns": ["feedback", "rating", "category"] }
      }
    ]
  }
}
```

### Scenario 3: Scheduled Task Execution

```json
{
  "targetAgentId": "agent-report-generator",
  "messageType": "task",
  "content": "Generate weekly performance reports for all active campaigns",
  "priority": "normal",
  "metadata": {
    "scheduledFor": "2024-01-15T09:00:00Z",
    "taskId": "weekly-reports",
    "tags": ["reporting", "weekly", "performance"]
  }
}
```

**What happens:**

1. ⏰ A cron job is created for the scheduled time
2. 📅 The message is stored with "scheduled" status
3. 🕘 At the specified time, the message is delivered
4. 💬 A conversation is started for the report generator

### Scenario 4: Response to Previous Task

```json
{
  "targetAgentId": "agent-project-manager",
  "messageType": "response",
  "content": "Research complete. I found 5 key trends in AI agent architectures. Full report attached.",
  "priority": "normal",
  "metadata": {
    "originalConversationId": "conv_1640995200_xyz789",
    "responseToMessageId": "a2a_1640995200_def456",
    "attachments": [
      {
        "type": "report",
        "data": { "format": "markdown", "sections": 5, "pages": 12 }
      }
    ]
  }
}
```

**What happens:**

1. 📧 The response is delivered immediately
2. 🔗 The response is linked to the original conversation
3. 💬 The project manager's active conversation continues
4. 📎 Attachments are preserved in metadata

### Scenario 5: Status Update Notification

```json
{
  "targetAgentId": "agent-monitor",
  "messageType": "status_update",
  "content": "Data pipeline completed successfully. Processed 50,000 records in 2.5 hours.",
  "priority": "low",
  "metadata": {
    "tags": ["pipeline", "completion", "metrics"],
    "workflowId": "daily-data-pipeline"
  }
}
```

**What happens:**

1. 📊 Status update is logged without creating a new conversation
2. 🔍 Monitor agent receives the notification
3. 📝 Information is available in agent's message history

## Additional Scenarios

### Scenario 6: Request-Response Pattern

**Initial Request:**

```json
{
  "targetAgentId": "agent-database-expert",
  "messageType": "request",
  "content": "What's the current schema version for the user authentication module?",
  "priority": "normal",
  "metadata": {
    "originalConversationId": "conv_active_session",
    "tags": ["database", "schema", "authentication"]
  }
}
```

**Response:**

```json
{
  "targetAgentId": "agent-backend-developer",
  "messageType": "response",
  "content": "Current schema version is 2.4.1. Last migration was applied on 2024-01-10.",
  "priority": "normal",
  "metadata": {
    "responseToMessageId": "a2a_request_123",
    "originalConversationId": "conv_active_session"
  }
}
```

### Scenario 7: Broadcast Notification

For broadcasting to multiple agents, send separate messages:

```json
[
  {
    "targetAgentId": "agent-monitor-1",
    "messageType": "notification",
    "content": "System maintenance scheduled for tonight at 2 AM EST",
    "priority": "high"
  },
  {
    "targetAgentId": "agent-monitor-2",
    "messageType": "notification",
    "content": "System maintenance scheduled for tonight at 2 AM EST",
    "priority": "high"
  }
]
```

### Scenario 8: Approval Workflow

**Request for Approval:**

```json
{
  "targetAgentId": "agent-security-approver",
  "messageType": "request",
  "content": "Requesting approval to deploy new authentication module to production",
  "priority": "high",
  "metadata": {
    "taskId": "deployment-approval-auth-v2.4.1",
    "tags": ["approval", "deployment", "security"],
    "expiresAt": "2024-01-15T17:00:00Z"
  }
}
```

**Approval Response:**

```json
{
  "targetAgentId": "agent-deployment-manager",
  "messageType": "response",
  "content": "APPROVED: Authentication module v2.4.1 cleared for production deployment",
  "priority": "high",
  "metadata": {
    "responseToMessageId": "a2a_approval_request_456",
    "tags": ["approved", "deployment", "go-ahead"]
  }
}
```

## Integration with Agent Discovery

The A2A Communication system works seamlessly with the Agent Discovery tool to enable intelligent agent collaboration:

### Discovery-First Workflow

```typescript
// Step 1: Discover suitable agents
const discoveryResult = await useAgentDiscovery({
  capabilities: ['database', 'performance'],
  status: 'active',
  includeMetadata: true,
})

// Step 2: Select the best agent
const targetAgent = discoveryResult.agents.find(
  (agent) => agent.toolsAvailable > 5 && agent.availability === 'available'
)

// Step 3: Communicate with the selected agent
if (targetAgent) {
  await useAgentToAgent({
    targetAgentId: targetAgent.id,
    messageType: 'task',
    content:
      'Database performance optimization needed for customer dashboard queries',
    priority: 'high',
    metadata: {
      discoveredVia: 'agentDiscovery',
      agentCapabilities: targetAgent.capabilities,
      selectionCriteria: 'tools>5 AND available',
    },
  })
}
```

### Smart Agent Selection

```typescript
// Find agents by role and select based on workload
const analysts = await useAgentDiscovery({
  role: 'analyst',
  status: 'active',
  includeMetadata: true,
  sortBy: 'lastActive',
})

// Select the least recently active agent for load balancing
const targetAgent = analysts.agents[0]
```

## Technical Implementation

### Tool Configuration

The A2A tool is automatically available to all agents and requires no external configuration:

```typescript
{
  id: 'agentToAgent',
  type: 'agentToAgent',
  canBeManaged: false, // Internal tool
  managedPrice: 0,
  allowedUsage: 10000, // High limit for internal communication
  configurationParams: {} // No external config needed
}
```

### Message Types

| Type            | Purpose                        | Creates Conversation | Use Case                               |
| --------------- | ------------------------------ | -------------------- | -------------------------------------- |
| `task`          | Delegate work to another agent | ✅ Yes               | "Process this data", "Generate report" |
| `workflow`      | Multi-step agent coordination  | ✅ Yes               | Pipeline stages, handoffs              |
| `request`       | Ask for information/assistance | ✅ Yes               | "What's the status?", "Can you help?"  |
| `response`      | Reply to previous message      | ❌ No                | Answers, completion notices            |
| `notification`  | Status updates, alerts         | ❌ No                | "Task completed", "System status"      |
| `status_update` | Progress reports               | ❌ No                | "50% complete", "Waiting for input"    |

### Priority Levels

- **`urgent`**: Critical issues requiring immediate attention
- **`high`**: Important tasks that should be prioritized
- **`normal`**: Standard priority for regular operations
- **`low`**: Background tasks and informational messages

### Database Integration

The A2A system integrates with several TeamHub database tables:

1. **`messages`**: Stores all A2A communications
2. **`agents`**: Validates target agents and checks status
3. **`cron`**: Handles scheduled message delivery
4. **`memory`**: Creates conversations and maintains context
5. **`organization`**: Ensures secure, organization-scoped communication

### Security & Isolation

- ✅ **Organization Boundary**: Agents can only communicate within their organization
- ✅ **Active Agent Validation**: Messages only sent to active agents
- ✅ **Audit Trail**: Complete logging of all communications
- ✅ **No External Network**: All communication is internal to TeamHub
- ✅ **Permission-Based**: Respects existing agent tool permissions

## Error Handling

The A2A tool provides comprehensive error handling:

### Target Agent Not Found

```json
{
  "success": false,
  "messageId": "",
  "targetAgent": {
    "id": "invalid-agent",
    "name": "Unknown",
    "isActive": false
  },
  "deliveryStatus": "failed",
  "message": "Target agent with ID invalid-agent not found"
}
```

### Inactive Agent

```json
{
  "success": false,
  "messageId": "",
  "targetAgent": {
    "id": "agent-123",
    "name": "Inactive Agent",
    "isActive": false
  },
  "deliveryStatus": "failed",
  "message": "Target agent Inactive Agent is not active"
}
```

### Successful Delivery

```json
{
  "success": true,
  "messageId": "a2a_1640995200_abc123",
  "conversationId": "conv_1640995200_xyz789",
  "targetAgent": {
    "id": "agent-456",
    "name": "Research Specialist",
    "isActive": true
  },
  "deliveryStatus": "delivered",
  "message": "Message successfully delivered to Research Specialist and conversation conv_1640995200_xyz789 created"
}
```

## Future Enhancements

### Phase 2: External Agent Communication

- **Cross-Organization**: Secure communication between organizations
- **API Integration**: REST/GraphQL endpoints for external systems
- **Authentication**: OAuth/API key based external agent authentication

### Phase 3: Advanced Features

- **Message Templates**: Pre-defined templates for common communications
- **Batch Operations**: Send messages to multiple agents efficiently
- **Message Queuing**: Advanced queuing and retry mechanisms
- **Analytics Dashboard**: Communication patterns and performance metrics

## Best Practices

### 1. **Clear Message Content**

- Use descriptive, actionable language
- Include all necessary context
- Specify expected outcomes or deliverables

### 2. **Appropriate Message Types**

- Use `task` for work delegation
- Use `workflow` for multi-step processes
- Use `response` to continue conversations
- Use `notification` for status updates

### 3. **Priority Management**

- Reserve `urgent` for critical issues
- Use `high` for time-sensitive tasks
- Default to `normal` for regular communications
- Use `low` for background/informational messages

### 4. **Metadata Usage**

- Always include relevant `tags` for categorization
- Use `taskId` and `workflowId` for tracking
- Set `expiresAt` for time-sensitive communications
- Use `attachments` for structured data exchange

### 5. **Error Handling**

- Always check the `success` field in responses
- Handle `failed` delivery status appropriately
- Implement retry logic for critical communications
- Log failed communications for debugging

This A2A communication system transforms TeamHub into a powerful multi-agent orchestration platform, enabling sophisticated agent workflows while maintaining security and simplicity through the existing tool architecture.
