import { create } from 'zustand'
import type { Agent } from '@teamhub/db'

type AgentStore = {
  selectedAgentId: string | null
  selectedAgent: Agent | null
  activeTab: string
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
  setSelectedAgentId: (id: string | null) => void
  setSelectedAgent: (agent: Agent | null) => void
  setActiveTab: (tab: string) => void
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

export const useAgentStore = create<AgentStore>((set, get) => ({
  selectedAgentId: null,
  selectedAgent: null,
  activeTab: 'chat',
  agentConversationStates: {},
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateAgentConversationState: (agentId, state) =>
    set((prev) => ({
      agentConversationStates: {
        ...prev.agentConversationStates,
        [agentId]: state,
      },
    })),
  getAgentConversationState: (agentId) => {
    const state = get().agentConversationStates[agentId]
    return state || null
  },
}))
