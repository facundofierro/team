import { create } from 'zustand'
import type { Agent } from '@teamhub/db'

export type AgentStore = {
  // Agent selection
  selectedAgentId: string | null
  selectedAgent: Agent | null
  activeTab: string

  // Navigation state (consolidated from navigationStore)
  currentPath: string | null
  isLoading: boolean

  // Conversation state persistence
  agentConversationStates: Record<
    string,
    {
      activeConversationId: string | null
      lastMessages: Array<{
        id: string
        role: 'user' | 'assistant'
        content: string
        timestamp: string
      }>
    }
  >

  // Actions
  setSelectedAgentId: (id: string | null) => void
  setSelectedAgent: (agent: Agent | null) => void
  setActiveTab: (tab: string) => void
  setCurrentPath: (path: string | null) => void
  setIsLoading: (loading: boolean) => void
  clearConversationStates: () => void

  // Conversation state management
  updateAgentConversationState: (
    agentId: string,
    state: {
      activeConversationId: string | null
      lastMessages: Array<{
        id: string
        role: 'user' | 'assistant'
        content: string
        timestamp: string
      }>
    }
  ) => void

  getAgentConversationState: (agentId: string) => {
    activeConversationId: string | null
    lastMessages: Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      timestamp: string
    }>
  } | null
}

export const useAgentStore = create<AgentStore>(
  (
    set: (
      partial:
        | Partial<AgentStore>
        | ((state: AgentStore) => Partial<AgentStore>)
    ) => void,
    get: () => AgentStore
  ) => ({
    // Initial state
    selectedAgentId: null,
    selectedAgent: null,
    activeTab: 'chat',
    currentPath: null,
    isLoading: false,
    agentConversationStates: {},

    // Actions with proper typing
    setSelectedAgentId: (id: string | null) =>
      set((prev: AgentStore) => ({
        ...prev,
        selectedAgentId: id,
        // Clear selected agent when switching IDs
        selectedAgent:
          prev.selectedAgent?.id === id ? prev.selectedAgent : null,
        // Clear conversation states when switching agents
        agentConversationStates:
          prev.selectedAgentId === id ? prev.agentConversationStates : {},
      })),

    setSelectedAgent: (agent: Agent | null) =>
      set((prev: AgentStore) => ({
        ...prev,
        selectedAgent: agent,
        // Clear conversation states when switching agents
        agentConversationStates:
          prev.selectedAgentId === agent?.id
            ? prev.agentConversationStates
            : {},
      })),

    setActiveTab: (tab: string) =>
      set((prev: AgentStore) => ({ ...prev, activeTab: tab })),
    setCurrentPath: (path: string | null) =>
      set((prev: AgentStore) => ({ ...prev, currentPath: path })),
    setIsLoading: (loading: boolean) =>
      set((prev: AgentStore) => ({ ...prev, isLoading: loading })),
    clearConversationStates: () =>
      set((prev: AgentStore) => ({ ...prev, agentConversationStates: {} })),

    updateAgentConversationState: (
      agentId: string,
      state: {
        activeConversationId: string | null
        lastMessages: Array<{
          id: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
        }>
      }
    ) =>
      set((prev: AgentStore) => ({
        ...prev,
        agentConversationStates: {
          ...prev.agentConversationStates,
          [agentId]: state,
        },
      })),

    getAgentConversationState: (agentId: string) => {
      const state = get().agentConversationStates[agentId]
      return state || null
    },
  })
)
