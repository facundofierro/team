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
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
          isSelected
            ? 'text-white bg-gradient-to-r from-purple-500 to-purple-600 border-purple-500 shadow-md'
            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
        }`}
      >
        {/* Expand/collapse button for parent agents */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpandToggle?.(agent)
            }}
            className={`flex-shrink-0 p-0.5 rounded transition-colors ${
              isSelected ? 'hover:bg-white/20' : 'hover:bg-gray-200'
            }`}
          >
            {isExpanded ? (
              <ChevronDown
                className={`w-4 h-4 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              />
            ) : (
              <ChevronRight
                className={`w-4 h-4 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              />
            )}
          </button>
        )}

        {/* Agent avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              isSelected
                ? 'text-white bg-white/20'
                : 'text-gray-700 bg-gray-100'
            }`}
          >
            {agent.avatar || agent.name.charAt(0).toUpperCase()}
          </div>
          <StatusIndicator status={agent.status} />
        </div>

        {/* Agent info */}
        <div className="flex-1 min-w-0 text-left">
          <p
            className={`text-sm font-medium truncate ${
              isSelected ? 'text-white' : 'text-gray-900'
            }`}
          >
            {agent.name}
          </p>
          <p
            className={`text-xs truncate ${
              isSelected ? 'text-white/80' : 'text-gray-500'
            }`}
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
    <div className="flex mb-4 space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
            activeTab === tab.key
              ? 'bg-purple-100 text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          {tab.key !== 'all' && (
            <div
              className={`w-2 h-2 rounded-full ${
                tab.key === 'active'
                  ? 'bg-green-400'
                  : tab.key === 'idle'
                  ? 'bg-yellow-400'
                  : 'bg-gray-400'
              }`}
            />
          )}
          <span>{tab.label}</span>
          <span className="text-xs opacity-75">({tab.count})</span>
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
      <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="py-2 pr-4 pl-10 w-full text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
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
  searchMode: 'search' | 'filter'
  viewMode: ViewMode
  onSearchModeChange: (mode: 'search' | 'filter') => void
  onViewModeChange: (mode: ViewMode) => void
  onNew?: () => void
}> = ({
  searchMode,
  viewMode,
  onSearchModeChange,
  onViewModeChange,
  onNew,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Search/Filter Mode Switcher */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => onSearchModeChange('search')}
          className={`p-1.5 rounded transition-colors ${
            searchMode === 'search'
              ? 'bg-white shadow-sm text-gray-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSearchModeChange('filter')}
          className={`p-1.5 rounded transition-colors ${
            searchMode === 'filter'
              ? 'bg-white shadow-sm text-gray-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'list'
              ? 'bg-white shadow-sm text-gray-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('hierarchical')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'hierarchical'
              ? 'bg-white shadow-sm text-gray-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </div>

      {/* New Button */}
      {onNew && (
        <button
          onClick={onNew}
          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
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
  const [searchMode, setSearchMode] = useState<'search' | 'filter'>('search')
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
      className={`p-6 bg-white rounded-xl border shadow-sm ${className}`}
      style={{
        backgroundColor: coreColors.background.card,
        borderColor: coreColors.border.light,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: coreColors.text.primary }}
        >
          Agents
        </h2>
        {showActionButtons && (
          <ActionButtons
            searchMode={searchMode}
            viewMode={viewMode}
            onSearchModeChange={setSearchMode}
            onViewModeChange={setViewMode}
            onNew={onAgentCreate}
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
      <div className="overflow-y-auto space-y-3 max-h-96">
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
      <div className="flex justify-between items-center pt-4 mt-6 border-t">
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
