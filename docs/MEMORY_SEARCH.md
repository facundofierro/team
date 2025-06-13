# Memory Search Tool

## Overview

The Memory Search Tool enables agents to search through their own memory to find relevant information from previous conversations, stored facts, preferences, and other knowledge. This tool is essential for agents to maintain context and continuity across conversations and tasks.

## Key Features

### 🧠 **Memory Types**

- **Conversations**: Previous chat interactions and dialogues
- **Facts**: Stored factual information and knowledge
- **Preferences**: User and agent preferences
- **Skills**: Learned capabilities and expertise
- **Context**: Situational information and context
- **Tasks**: Completed and ongoing task information

### 🔍 **Search Capabilities**

- **Text-based Search**: Traditional keyword and phrase matching
- **Semantic Search**: Vector similarity search (when available)
- **Filtered Search**: Filter by type, category, importance, and date range
- **Relevance Ranking**: Results ordered by importance and relevance

### 📊 **Advanced Filtering**

- **Type Filtering**: Search specific memory types
- **Category Filtering**: Filter by memory categories
- **Time Range**: Search within specific date ranges
- **Importance Level**: Filter by importance scores (1-10)
- **Result Limiting**: Control number of results returned

## Tool Configuration

```typescript
{
  id: 'memorySearch',
  type: 'memorySearch',
  canBeManaged: false, // Internal tool
  managedPrice: 0,
  allowedUsage: 10000, // High limit for memory access
  configurationParams: {} // No external config needed
}
```

## Usage Examples

### Example 1: Basic Memory Search

**Search Query:**

```json
{
  "query": "project deadlines",
  "limit": 5
}
```

**Expected Result:**

```json
{
  "success": true,
  "results": [
    {
      "id": "mem_123",
      "type": "conversation",
      "category": "chat",
      "title": "Project Planning Discussion",
      "summary": "Discussed upcoming project deadlines and milestones",
      "importance": 8,
      "messageCount": 15,
      "relevantExcerpts": [
        "The deadline for the API is next Friday",
        "We need to complete testing by end of week"
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "tags": ["project", "deadlines", "planning"]
    }
  ],
  "totalFound": 3,
  "searchMethod": "text",
  "message": "Found 3 memories matching \"project deadlines\""
}
```

### Example 2: Filtered Memory Search

**Search Query:**

```json
{
  "query": "user preferences",
  "types": ["preference", "fact"],
  "categories": ["user_preference", "settings"],
  "importance": {
    "min": 5
  },
  "limit": 10
}
```

**Expected Result:**

```json
{
  "success": true,
  "results": [
    {
      "id": "mem_456",
      "type": "preference",
      "category": "user_preference",
      "title": "Communication Preferences",
      "summary": "User prefers concise responses and bullet points",
      "importance": 7,
      "messageCount": 1,
      "relevantExcerpts": [
        "Please keep responses brief",
        "Bullet points are preferred"
      ],
      "createdAt": "2024-01-10T14:20:00Z",
      "tags": ["communication", "style", "preferences"]
    }
  ],
  "totalFound": 5,
  "searchMethod": "text",
  "message": "Found 5 memories matching \"user preferences\" (types: preference, fact)"
}
```

### Example 3: Time-Range Search

**Search Query:**

```json
{
  "query": "technical discussions",
  "types": ["conversation"],
  "timeRange": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "limit": 15
}
```

### Example 4: Semantic Search (When Available)

**Search Query:**

```json
{
  "query": "database optimization strategies",
  "useSemanticSearch": true,
  "types": ["conversation", "fact"],
  "limit": 8
}
```

**Expected Result:**

```json
{
  "success": true,
  "results": [
    {
      "id": "mem_789",
      "type": "fact",
      "category": "technical_knowledge",
      "title": "Database Performance Tips",
      "summary": "Various strategies for optimizing database queries and indexes",
      "importance": 9,
      "similarity": 0.87,
      "relevantExcerpts": [
        "Index optimization can improve query speed by 300%"
      ],
      "createdAt": "2024-01-12T16:45:00Z",
      "tags": ["database", "performance", "optimization"]
    }
  ],
  "totalFound": 4,
  "searchMethod": "semantic",
  "message": "Found 4 memories matching \"database optimization strategies\" using semantic search"
}
```

## Agent Context Requirements

### Current Limitation

The Memory Search Tool currently requires agent context to function properly. The tool needs to know:

- **Agent ID**: Which agent's memory to search
- **Database Name**: Which database contains the agent's memory
- **Organization ID**: For database resolution (if database name not provided)

### Context Resolution Priority

1. **Parameters**: Explicitly provided in the tool call
2. **Configuration**: From tool configuration (not currently implemented)
3. **Execution Context**: From the agent's current execution context (future enhancement)

### Example with Agent Context

```json
{
  "query": "previous conversations about API design",
  "agentId": "agent_123",
  "databaseName": "org_database_456",
  "types": ["conversation"],
  "limit": 10
}
```

## Integration Examples

### Example 1: Contextual Response Generation

An agent can search their memory before responding to maintain context:

```typescript
// Search for relevant previous conversations
const memoryResults = await useMemorySearch({
  query: "user's project requirements and preferences",
  types: ['conversation', 'preference'],
  limit: 5,
})

// Use the results to inform the response
const context = memoryResults.results.map((r) => r.summary).join('\n')

const response = `Based on our previous conversations:\n${context}\n\nHere's my recommendation...`
```

### Example 2: Task Context Retrieval

Before starting a new task, search for related previous work:

```typescript
const relatedWork = await useMemorySearch({
  query: taskDescription,
  types: ['task', 'conversation'],
  useSemanticSearch: true,
  limit: 8,
})

const insights = relatedWork.results
  .filter((r) => r.importance >= 7)
  .map((r) => r.relevantExcerpts)
  .flat()
```

### Example 3: Preference-Aware Responses

Search for user preferences to customize responses:

```typescript
const userPrefs = await useMemorySearch({
  query: 'communication style preferences format',
  types: ['preference'],
  categories: ['user_preference', 'communication'],
  limit: 3,
})

const prefersBullets = userPrefs.results.some(
  (r) => r.summary.includes('bullet') || r.summary.includes('list')
)
```

## Technical Implementation

### Memory Types Supported

| Type           | Description                     | Use Case                                   |
| -------------- | ------------------------------- | ------------------------------------------ |
| `conversation` | Chat dialogues and interactions | Context retrieval, conversation continuity |
| `fact`         | Stored factual information      | Knowledge retrieval, fact checking         |
| `preference`   | User and agent preferences      | Personalization, customization             |
| `skill`        | Learned capabilities            | Capability assessment, skill application   |
| `context`      | Situational information         | Context-aware responses                    |
| `task`         | Task-related information        | Task continuity, project management        |

### Search Methods

| Method     | Description                 | Requirements                   | Performance              |
| ---------- | --------------------------- | ------------------------------ | ------------------------ |
| `text`     | Keyword and phrase matching | None                           | Fast                     |
| `semantic` | Vector similarity search    | pgvector extension, embeddings | Slower but more accurate |

### Result Ranking

Results are ranked by:

1. **Importance Score** (1-10 scale)
2. **Recency** (creation date)
3. **Similarity Score** (for semantic search)
4. **Access Frequency** (how often accessed)

## Future Enhancements

### Planned Features

- **Automatic Agent Context**: Tool execution with automatic agent context resolution
- **Enhanced Semantic Search**: Better embedding generation and similarity matching
- **Memory Summarization**: Automatic summary generation for search results
- **Cross-Agent Memory**: Search capabilities across related agents (with permissions)
- **Memory Analytics**: Usage patterns and memory optimization suggestions

### Configuration Enhancements

- **Search Preferences**: Agent-specific search behavior configuration
- **Result Formatting**: Customizable result formats
- **Caching**: Memory search result caching for performance

## Error Handling

### Common Errors

| Error                                    | Cause                            | Solution                                                             |
| ---------------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `Memory search requires agentId`         | No agent context provided        | Provide agentId parameter or ensure tool has access to agent context |
| `Unable to determine database name`      | No database context              | Provide databaseName or organizationId parameter                     |
| `Vector similarity search not available` | pgvector extension not installed | Use text search or install pgvector extension                        |
| `No memories found`                      | No matching memories exist       | Broaden search criteria or check memory storage                      |

### Error Response Format

```json
{
  "success": false,
  "results": [],
  "query": "search query",
  "totalFound": 0,
  "searchMethod": "text",
  "message": "Failed to search memories: error description"
}
```

## Best Practices

### Search Query Optimization

- **Be Specific**: Use specific terms for better results
- **Use Multiple Terms**: Combine related keywords
- **Consider Context**: Include contextual terms
- **Use Filters**: Narrow down with type and category filters

### Performance Considerations

- **Limit Results**: Use appropriate limit values
- **Filter Early**: Apply filters to reduce search scope
- **Cache Results**: Store frequently accessed memories
- **Monitor Usage**: Track search patterns for optimization

### Memory Management

- **Regular Cleanup**: Archive old, low-importance memories
- **Importance Scoring**: Properly score memory importance
- **Categorization**: Use consistent category names
- **Tagging**: Apply relevant tags for better searchability
