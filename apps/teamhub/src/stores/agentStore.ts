import { create } from 'zustand'
import type { Agent } from '@teamhub/db'

type AgentStore = {
  selectedAgentId: string | null
  selectedAgent: Agent | null
  activeTab: string
  setSelectedAgentId: (id: string | null) => void
  setSelectedAgent: (agent: Agent | null) => void
  setActiveTab: (tab: string) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  selectedAgentId: null,
  selectedAgent: null,
  activeTab: 'chat',
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
