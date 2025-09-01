/**
 * AgentsList Component
 * Main component that displays a list of agents with filtering, search, and hierarchical view
 */

import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  List,
  Grid3X3,
  Plus,
  ChevronDown,
  ChevronRight,
  Wifi,
} from 'lucide-react'
import { coreColors } from '../light-theme-colors'
import { componentColors } from '../dark-theme-colors'
import type {
  Agent,
  AgentsListProps,
  AgentStats,
  StatusTab,
  ViewMode,
} from './types'

// Utility function to calculate agent stats
const calculateStats = (agents: Agent[]): AgentStats => {
  return agents.reduce(
    (stats, agent) => {
      stats.total++
      switch (agent.status) {
        case 'active':
          stats.active++
          break
        case 'idle':
          stats.idle++
          break
        case 'offline':
          stats.offline++
          break
      }
      return stats
    },
    { total: 0, active: 0, idle: 0, offline: 0 }
  )
}

// Status indicator component
const StatusIndicator: React.FC<{ status: Agent['status'] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div
      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor()}`}
    />
  )
}

// Agent card component
const AgentCard: React.FC<{
  agent: Agent
  isSelected: boolean
  isChild?: boolean
  onSelect: (agent: Agent) => void
  onExpandToggle?: (agent: Agent) => void
  isExpanded?: boolean
}> = ({
  agent,
  isSelected,
  isChild = false,
  onSelect,
  onExpandToggle,
  isExpanded,
}) => {
  const hasChildren = agent.children && agent.children.length > 0

  return (
    <div className={`${isChild ? 'ml-6' : ''}`}>
      <button
        onClick={() => onSelect(agent)}
        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 border ${
          isSelected
            ? 'bg-purple-50 border-purple-200 shadow-sm'
            : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
        }`}
        style={{
          backgroundColor: isSelected ? coreColors.brand.accent : 'transparent',
          borderColor: isSelected ? coreColors.border.focus : 'transparent',
        }}
      >
        {/* Expand/collapse button for parent agents */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpandToggle?.(agent)
            }}
            className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Agent avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: coreColors.background.secondary,
              color: coreColors.text.secondary,
            }}
          >
            {agent.avatar || agent.name.charAt(0).toUpperCase()}
          </div>
          <StatusIndicator status={agent.status} />
        </div>

        {/* Agent info */}
        <div className="flex-1 text-left min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: coreColors.text.primary }}
          >
            {agent.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: coreColors.text.tertiary }}
          >
            {agent.description}
          </p>
        </div>
      </button>

      {/* Child agents */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {agent.children?.map((child) => (
            <AgentCard
              key={child.id}
              agent={child}
              isSelected={isSelected}
              isChild={true}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Status tabs component
const StatusTabs: React.FC<{
  stats: AgentStats
  activeTab: StatusTab
  onTabChange: (tab: StatusTab) => void
}> = ({ stats, activeTab, onTabChange }) => {
  const tabs = [
    { key: 'all' as const, label: 'All', count: stats.total },
    { key: 'active' as const, label: 'On', count: stats.active },
    { key: 'idle' as const, label: 'Idle', count: stats.idle },
    { key: 'offline' as const, label: 'Off', count: stats.offline },
  ]

  return (
    <div className="flex space-x-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === tab.key
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          style={{
            backgroundColor:
              activeTab === tab.key ? coreColors.brand.accent : 'transparent',
            color:
              activeTab === tab.key
                ? coreColors.brand.primary
                : coreColors.text.secondary,
          }}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  )
}

// Search bar component
const SearchBar: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
}> = ({ value, onChange, placeholder = 'Search agents...' }) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2"
        style={{
          backgroundColor: coreColors.background.card,
          borderColor: coreColors.border.light,
          color: coreColors.text.primary,
          focusRing: coreColors.focus.ring,
        }}
      />
    </div>
  )
}

// Action buttons component
const ActionButtons: React.FC<{
  onSearch?: () => void
  onFilter?: () => void
  onViewToggle?: () => void
  onSort?: () => void
  onNew?: () => void
  viewMode?: ViewMode
}> = ({
  onSearch,
  onFilter,
  onViewToggle,
  onSort,
  onNew,
  viewMode = 'list',
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {onSearch && (
          <button
            onClick={onSearch}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ backgroundColor: 'transparent' }}
          >
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {onFilter && (
          <button
            onClick={onFilter}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {onSort && (
          <button
            onClick={onSort}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <List className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {onViewToggle && (
          <button
            onClick={onViewToggle}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'hierarchical'
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {onNew && (
        <button
          onClick={onNew}
          className="ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          style={{
            backgroundColor: coreColors.interactive.actionDefault,
            color: coreColors.interactive.actionText,
          }}
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      )}
    </div>
  )
}

// Main AgentsList component
export const AgentsList: React.FC<AgentsListProps> = ({
  agents,
  onAgentSelect,
  onAgentCreate,
  selectedAgentId,
  showHierarchical = true,
  showSearch = true,
  showActionButtons = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())

  // Calculate stats
  const stats = useMemo(() => calculateStats(agents), [agents])

  // Filter agents based on search and active tab
  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((agent) => agent.status === activeTab)
    }

    return filtered
  }, [agents, searchQuery, activeTab])

  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    onAgentSelect?.(agent)
  }

  // Handle expand/collapse for hierarchical view
  const handleExpandToggle = (agent: Agent) => {
    const newExpanded = new Set(expandedAgents)
    if (newExpanded.has(agent.id)) {
      newExpanded.delete(agent.id)
    } else {
      newExpanded.add(agent.id)
    }
    setExpandedAgents(newExpanded)
  }

  return (
    <div
      className={`bg-white rounded-xl border p-6 ${className}`}
      style={{
        backgroundColor: coreColors.background.card,
        borderColor: coreColors.border.light,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: coreColors.text.primary }}
        >
          Agents
        </h2>
        {showActionButtons && (
          <ActionButtons
            onSearch={() => {}}
            onFilter={() => {}}
            onViewToggle={() =>
              setViewMode(viewMode === 'list' ? 'hierarchical' : 'list')
            }
            onSort={() => {}}
            onNew={onAgentCreate}
            viewMode={viewMode}
          />
        )}
      </div>

      {/* Search bar */}
      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search agents..."
        />
      )}

      {/* Status tabs */}
      <StatusTabs
        stats={stats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Agents list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgentId === agent.id}
            onSelect={handleAgentSelect}
            onExpandToggle={showHierarchical ? handleExpandToggle : undefined}
            isExpanded={expandedAgents.has(agent.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div
          className="flex items-center space-x-2 text-sm"
          style={{ color: coreColors.text.tertiary }}
        >
          <span>{stats.total} agents</span>
          <span>•</span>
          <span>{stats.active} active</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <Wifi className="w-4 h-4" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  )
}
