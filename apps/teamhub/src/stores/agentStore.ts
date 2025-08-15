import { create } from 'zustand'

/**
 * Simplified Agent Store - Only UI state, not data cache
 * Data is now handled by reactive cache system
 */
export type AgentStore = {
  // Core UI state only
  selectedAgentId: string | null // Which agent is currently selected
  activeTab: string // Current UI tab (chat/memory/tools)
  
  // Navigation state
  currentPath: string | null
  isLoading: boolean

  // Actions
  setSelectedAgentId: (id: string | null) => void
  setActiveTab: (tab: string) => void
  setCurrentPath: (path: string | null) => void
  setIsLoading: (loading: boolean) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  // Initial state - minimal UI state only
  selectedAgentId: null,
  activeTab: 'chat',
  currentPath: null,
  isLoading: false,

  // Simple actions
  setSelectedAgentId: (id: string | null) =>
    set({ selectedAgentId: id }),
    
  setActiveTab: (tab: string) =>
    set({ activeTab: tab }),
    
  setCurrentPath: (path: string | null) =>
    set({ currentPath: path }),
    
  setIsLoading: (loading: boolean) =>
    set({ isLoading: loading }),
}))
