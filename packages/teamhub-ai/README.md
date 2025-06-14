# @teamhub/ai

A comprehensive AI library for TeamHub that provides various AI-powered functions for chat, task management, workflows, and tool integration.

## Installation

This is a private package within the TeamHub monorepo. Install dependencies with:

```bash
pnpm install
```

## Available Functions

### Chat Functions

#### `sendChat(params)`

Sends a chat message to an AI agent with memory management and streaming response support.

**Parameters:**

- `databaseName` (string): Name of the database to use
- `text` (string): The message text to send
- `agentId` (string): ID of the target agent
- `agentCloneId` (string, optional): ID of the agent clone
- `memoryRules` (AgentMemoryRule[], optional): Rules for memory management
- `storeRule` (MemoryStoreRule, optional): Rules for storing the conversation

**Returns:** `Response` - A streaming response object

**Example:**

```typescript
import { sendChat } from '@teamhub/ai'

const response = await sendChat({
  databaseName: 'my-database',
  text: 'Hello, how can you help me?',
  agentId: 'agent-123',
  storeRule: {
    messageType: 'user_message',
    shouldStore: true,
    retentionDays: 30,
    category: 'chat',
  },
})
```

### Task Management

#### `sendTask(params)`

Creates and sends a task to an agent with optional cron scheduling.

**Parameters:**

- `taskId` (string): Unique identifier for the task
- `metadata` (TaskMetadata): Task metadata
- `agentId` (string): ID of the target agent
- `agentCloneId` (string, optional): ID of the agent clone
- `fromAgentId` (string, optional): ID of the sending agent
- `memoryRules` (AgentMemoryRule[], optional): Memory management rules
- `storeRule` (MemoryStoreRule, optional): Storage rules
- `tools` (AgentToolPermission[], optional): Available tools for the task
- `cron` (CronConfig, optional): Cron scheduling configuration

**Returns:** `Message` - Created message object

**Example:**

```typescript
import { sendTask } from '@teamhub/ai'

const message = await sendTask({
  taskId: 'task-123',
  metadata: { priority: 'high', category: 'analysis' },
  agentId: 'agent-456',
  cron: {
    schedule: '0 9 * * *', // Daily at 9 AM
    startDate: new Date(),
  },
})
```

#### `sendWorkflow(params)`

Sends multiple tasks as a workflow to an agent.

**Parameters:**

- `tasks` (Array): Array of task objects with `taskId` and `metadata`
- `agentId` (string): ID of the target agent
- `agentCloneId` (string, optional): ID of the agent clone
- `fromAgentId` (string, optional): ID of the sending agent
- `memoryRules` (AgentMemoryRule[], optional): Memory management rules
- `storeRule` (MemoryStoreRule, optional): Storage rules

**Returns:** `Message[]` - Array of created message objects

**Example:**

```typescript
import { sendWorkflow } from '@teamhub/ai'

const messages = await sendWorkflow({
  tasks: [
    { taskId: 'task-1', metadata: { step: 1 } },
    { taskId: 'task-2', metadata: { step: 2 } },
  ],
  agentId: 'agent-789',
})
```

### Information Sharing

#### `sendInfo(params)`

Sends informational content to an agent.

**Parameters:**

- `infoType` (string): Type of information being sent
- `content` (string): The information content
- `metadata` (TaskMetadata, optional): Additional metadata
- `agentId` (string): ID of the target agent
- `agentCloneId` (string, optional): ID of the agent clone
- `fromAgentId` (string, optional): ID of the sending agent
- `memoryRules` (AgentMemoryRule[], optional): Memory management rules
- `storeRule` (MemoryStoreRule, optional): Storage rules

**Returns:** `Message` - Created message object

**Example:**

```typescript
import { sendInfo } from '@teamhub/ai'

const message = await sendInfo({
  infoType: 'document_update',
  content: 'The project documentation has been updated',
  agentId: 'agent-101',
  metadata: { documentId: 'doc-456' },
})
```

### Cron Management

#### `cronExecute(cronId)`

Executes a scheduled cron job by ID.

**Parameters:**

- `cronId` (string): ID of the cron job to execute

**Returns:** `Message` - The message associated with the cron job

**Example:**

```typescript
import { cronExecute } from '@teamhub/ai'

const message = await cronExecute('cron-123')
```

### Tool Management

#### `getToolTypes()`

Retrieves all available tool types in the system.

**Returns:** `ToolTypeWithTypes[]` - Array of available tool types

**Example:**

```typescript
import { getToolTypes } from '@teamhub/ai'

const toolTypes = await getToolTypes()
console.log(toolTypes) // Available tools: searchGoogle, searchDuckDuckGo, searchYandex
```

#### `getToolHandler(toolId)`

Gets a handler function for a specific tool.

**Parameters:**

- `toolId` (string): ID of the tool

**Returns:** `Function` - Tool handler function that can be called with parameters

**Example:**

```typescript
import { getToolHandler } from '@teamhub/ai'

const handler = await getToolHandler('search-google')
const result = await handler({ query: 'AI technology trends' })
```

## Types

### `MemoryStoreRule`

Configuration for storing messages in memory.

```typescript
type MemoryStoreRule = {
  messageType: string // Type of message to store
  shouldStore: boolean // Whether to store the message
  retentionDays?: number // Days to retain the message
  category?: string // Category for organization
}
```

### `CronConfig`

Configuration for cron job scheduling.

```typescript
type CronConfig = {
  schedule: string // Cron schedule expression
  startDate?: Date // When to start the cron job
  endDate?: Date // When to end the cron job
}
```

### `TaskMetadata`

Flexible metadata type for tasks.

```typescript
type TaskMetadata = {
  [key: string]: unknown
}
```

## Available Tools

The library includes several built-in tools:

### Search Tools

- **Google Search** - Search using Google's search engine
- **DuckDuckGo Search** - Privacy-focused search engine
- **Yandex Search** - Russian search engine

### Agent Communication Tools

- **Agent-to-Agent Communication** - Send messages, tasks, and workflows to other agents
- **Agent Discovery** - Find and discover other agents within the organization

### Memory Tools

- **Memory Search** - Search through an agent's memory for relevant information from previous conversations, facts, preferences, and stored knowledge

These tools can be accessed via the `getToolTypes()` and `getToolHandler()` functions.

For detailed documentation on individual tools, see:

- [Memory Search Tool](../../../docs/MEMORY_SEARCH.md)
- [Agent-to-Agent Communication](../../../docs/A2A_COMMUNICATION.md)
- [Agent Discovery](../../../docs/AGENT_DISCOVERY.md)

## Dependencies

- `@ai-sdk/deepseek` - DeepSeek AI integration
- `@ai-sdk/openai` - OpenAI integration
- `@teamhub/db` - TeamHub database layer
- `ai` - Vercel AI SDK
- `zod` - TypeScript-first schema validation

## Development

Build the library:

```bash
pnpm build
```

The library is written in TypeScript and uses the TeamHub database layer for persistence and AI SDK for model interactions.
