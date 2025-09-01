/**
 * TypeScript interfaces for AgentsList component
 */

export interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'idle' | 'offline'
  avatar?: string
  parentId?: string // For hierarchical relationships
  children?: Agent[]
}

export interface AgentStats {
  total: number
  active: number
  idle: number
  offline: number
}

export interface AgentsListProps {
  agents: Agent[]
  onAgentSelect?: (agent: Agent) => void
  onAgentCreate?: () => void
  selectedAgentId?: string
  showHierarchical?: boolean
  showSearch?: boolean
  showActionButtons?: boolean
  className?: string
}

export interface StatusTabsProps {
  stats: AgentStats
  activeTab: 'all' | 'active' | 'idle' | 'offline'
  onTabChange: (tab: 'all' | 'active' | 'idle' | 'offline') => void
}

export interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  isChild?: boolean
  onSelect: (agent: Agent) => void
  onExpandToggle?: (agent: Agent) => void
  isExpanded?: boolean
}

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface ActionButtonsProps {
  onSearch?: () => void
  onFilter?: () => void
  onViewToggle?: () => void
  onSort?: () => void
  onNew?: () => void
  viewMode?: 'list' | 'hierarchical'
}

export type AgentStatus = 'active' | 'idle' | 'offline'
export type ViewMode = 'list' | 'hierarchical'
export type StatusTab = 'all' | 'active' | 'idle' | 'offline'
