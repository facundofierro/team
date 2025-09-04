// Example usage of the unified memory system
import { getFunctions } from './functions'
import type {
  ConversationMessage,
  FactContent,
  PreferenceContent,
} from './types'

// Example: How to create and manage conversations
export async function exampleConversationWorkflow(
  db: ReturnType<typeof getFunctions>
) {
  // 1. Create a new conversation
  const conversation = await db.createConversation({
    id: 'conv_123',
    agentId: 'agent_abc',
    agentCloneId: null,
    category: 'chat',
    title: 'Project Planning Discussion',
    content: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'I need help planning my new web application project',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content:
          "I'd be happy to help! What type of web application are you building?",
        timestamp: new Date().toISOString(),
      },
    ] as ConversationMessage[],
    summary: 'User seeking help with web application project planning',
    description:
      'Discussion about planning and development approach for a new web app',
    keyTopics: ['web development', 'project planning', 'application'],
    tags: ['planning', 'development'],
    participantIds: ['user_xyz', 'agent_abc'],
    importance: 7,
    messageCount: 2,
  })

  console.log('Created conversation:', conversation.id)

  // 2. Update conversation with new messages
  const updatedMessages: ConversationMessage[] = [
    ...conversation.content,
    {
      id: 'msg_3',
      role: 'user',
      content: "It's a task management app for teams",
      timestamp: new Date().toISOString(),
    },
    {
      id: 'msg_4',
      role: 'assistant',
      content:
        'Great! For a team task management app, I recommend starting with user authentication, then building the core task CRUD operations...',
      timestamp: new Date().toISOString(),
    },
  ]

  await db.updateConversation(
    conversation.id,
    updatedMessages,
    'User building a team task management app. Provided initial architecture recommendations.',
    [
      'task management',
      'team collaboration',
      'user authentication',
      'CRUD operations',
    ]
  )

  // 3. Extract facts from the conversation
  await db.createFact({
    id: 'fact_1',
    agentId: 'agent_abc',
    category: 'user_project',
    title: 'User is building a task management app',
    content: {
      fact: 'User is developing a team task management application',
      context: 'Mentioned during project planning discussion',
      confidence: 9,
      source: conversation.id,
    } as FactContent,
    summary: 'User project: team task management app',
    importance: 8,
    tags: ['user_project', 'task_management'],
  })

  // 4. Create a preference memory
  await db.createPreference({
    id: 'pref_1',
    agentId: 'agent_abc',
    category: 'development_preference',
    title: 'User prefers React for frontend',
    content: {
      preference: 'frontend_framework',
      value: 'React',
      context: 'Mentioned preference during architecture discussion',
    } as PreferenceContent,
    summary: 'Prefers React for frontend development',
    importance: 6,
    tags: ['frontend', 'react', 'preference'],
  })

  return { conversation, updatedMessages }
}

// Example: How to search and retrieve memories
export async function exampleMemoryRetrieval(
  db: ReturnType<typeof getFunctions>
) {
  const agentId = 'agent_abc'

  // 1. Get all conversations for an agent
  const conversations = await db.getConversations(agentId, undefined, 10)
  console.log(`Found ${conversations.length} conversations`)

  // 2. Get specific types of memories
  const facts = await db.getAgentMemories(agentId, {
    types: ['fact'],
    categories: ['user_project'],
    limit: 20,
    orderBy: 'importance',
  })
  console.log(`Found ${facts.length} project-related facts`)

  // 3. Search memories by text
  const searchResults = await db.searchMemories(agentId, 'task management', {
    types: ['conversation', 'fact'],
    limit: 5,
  })
  console.log(`Found ${searchResults.length} memories about task management`)

  // 4. Vector similarity search (requires embeddings)
  const exampleEmbedding = new Array(1536).fill(0).map(() => Math.random())
  const similarMemories = await db.searchSimilarMemories(
    agentId,
    exampleEmbedding,
    {
      types: ['conversation'],
      limit: 3,
    }
  )
  console.log(`Found ${similarMemories.length} similar conversations`)

  // 5. Get memory statistics
  const stats = await db.getMemoryStats(agentId)
  console.log('Memory stats:', stats)

  return { conversations, facts, searchResults, similarMemories, stats }
}

// Example: Memory lifecycle management
export async function exampleMemoryLifecycle(
  db: ReturnType<typeof getFunctions>
) {
  const memoryId = 'conv_123'

  // 1. Record access to update usage stats
  await db.recordMemoryAccess(memoryId)

  // 2. Archive old conversation
  await db.archiveMemory(memoryId)

  // 3. Soft delete if needed
  await db.deleteMemory(memoryId) // This sets status to 'deleted'

  console.log(`Memory ${memoryId} lifecycle updated`)
}

// Example: Conversation workflow for ChatCard integration
export async function chatCardConversationExample(
  db: ReturnType<typeof getFunctions>
) {
  const agentId = 'agent_abc'
  const userId = 'user_xyz'

  // This is how you'd integrate with ChatCard component:

  // 1. When starting a new chat - create conversation
  const newConversation = await db.createConversation({
    id: `conv_${Date.now()}`,
    agentId,
    agentCloneId: null,
    category: 'chat',
    title: 'New Conversation', // Will be auto-generated later
    content: [] as ConversationMessage[],
    description: 'Active chat conversation',
    participantIds: [userId, agentId],
    importance: 5,
    messageCount: 0,
  })

  // 2. As messages are sent - update conversation
  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    const currentConv = (await db.getMemory(newConversation.id)) as any
    if (!currentConv) return

    const newMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [
      ...(currentConv.content as ConversationMessage[]),
      newMessage,
    ]

    await db.updateConversation(
      newConversation.id,
      updatedMessages,
      role === 'user' ? undefined : content.slice(0, 200) + '...' // Update summary with AI responses
    )
  }

  // 3. Load conversation list for UI
  const getConversationList = async () => {
    return await db.getConversations(agentId, undefined, 20)
  }

  // 4. Search conversations for context
  const searchConversationContext = async (query: string) => {
    return await db.searchMemories(agentId, query, {
      types: ['conversation'],
      limit: 5,
    })
  }

  return {
    newConversation,
    addMessage,
    getConversationList,
    searchConversationContext,
  }
}
