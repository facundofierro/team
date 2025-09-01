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
        return coreColors.status.success
      case 'idle':
        return coreColors.status.warning
      case 'offline':
        return coreColors.text.disabled
      default:
        return coreColors.text.disabled
    }
  }

  return (
    <div
      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
      style={{
        backgroundColor: getStatusColor(),
        borderColor: coreColors.background.card,
      }}
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
        className="flex items-center px-4 py-3 space-x-3 w-full rounded-xl border shadow-sm transition-all duration-200"
        style={{
          backgroundColor: isSelected
            ? coreColors.brand.primary
            : coreColors.background.card,
          borderColor: isSelected
            ? coreColors.brand.primary
            : coreColors.border.light,
          color: isSelected ? coreColors.text.inverse : coreColors.text.primary,
          boxShadow: isSelected
            ? '0 4px 12px rgba(0, 0, 0, 0.15)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor =
              coreColors.background.secondary
            e.currentTarget.style.borderColor = coreColors.border.medium
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = coreColors.background.card
            e.currentTarget.style.borderColor = coreColors.border.light
          }
        }}
      >
        {/* Expand/collapse button for parent agents */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpandToggle?.(agent)
            }}
            className="flex-shrink-0 p-0.5 rounded-lg transition-colors"
            style={{
              color: isSelected
                ? coreColors.text.inverse
                : coreColors.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isSelected
                ? 'rgba(255, 255, 255, 0.2)'
                : coreColors.background.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Agent avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="flex justify-center items-center w-8 h-8 text-xs font-medium rounded-full"
            style={{
              backgroundColor: isSelected
                ? 'rgba(255, 255, 255, 0.2)'
                : coreColors.background.secondary,
              color: isSelected
                ? coreColors.text.inverse
                : coreColors.text.secondary,
            }}
          >
            {agent.avatar || agent.name.charAt(0).toUpperCase()}
          </div>
          <StatusIndicator status={agent.status} />
        </div>

        {/* Agent info */}
        <div className="flex-1 min-w-0 text-left">
          <p
            className="text-sm font-medium truncate"
            style={{
              color: isSelected
                ? coreColors.text.inverse
                : coreColors.text.primary,
            }}
          >
            {agent.name}
          </p>
          <p
            className="text-xs truncate"
            style={{
              color: isSelected
                ? 'rgba(255, 255, 255, 0.8)'
                : coreColors.text.tertiary,
            }}
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
          className="flex items-center px-4 py-2 space-x-1 text-sm font-medium rounded-full transition-all duration-200"
          style={{
            backgroundColor:
              activeTab === tab.key ? coreColors.brand.accent : 'transparent',
            color:
              activeTab === tab.key
                ? coreColors.brand.primary
                : coreColors.text.secondary,
            boxShadow:
              activeTab === tab.key ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.key) {
              e.currentTarget.style.backgroundColor =
                coreColors.background.secondary
              e.currentTarget.style.color = coreColors.text.primary
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.key) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
        >
          {tab.key !== 'all' && (
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  tab.key === 'active'
                    ? coreColors.status.success
                    : tab.key === 'idle'
                    ? coreColors.status.warning
                    : coreColors.text.disabled,
              }}
            />
          )}
          <span>{tab.label}</span>
          <span style={{ opacity: 0.75 }}>({tab.count})</span>
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
      <Search
        className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2"
        style={{ color: coreColors.text.tertiary }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="py-2 pr-4 pl-10 w-full text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2"
        style={{
          backgroundColor: coreColors.background.card,
          borderColor: coreColors.border.light,
          color: coreColors.text.primary,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = coreColors.border.focus
          e.target.style.boxShadow = `0 0 0 2px ${coreColors.focus.ring}`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = coreColors.border.light
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
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
      <div
        className="flex items-center rounded-xl p-0.5"
        style={{ backgroundColor: coreColors.background.secondary }}
      >
        <button
          onClick={() => onSearchModeChange('search')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              searchMode === 'search'
                ? coreColors.background.card
                : 'transparent',
            color:
              searchMode === 'search'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              searchMode === 'search' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (searchMode !== 'search') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (searchMode !== 'search') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSearchModeChange('filter')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              searchMode === 'filter'
                ? coreColors.background.card
                : 'transparent',
            color:
              searchMode === 'filter'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              searchMode === 'filter' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (searchMode !== 'filter') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (searchMode !== 'filter') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* View Mode Switcher */}
      <div
        className="flex items-center rounded-xl p-0.5"
        style={{ backgroundColor: coreColors.background.secondary }}
      >
        <button
          onClick={() => onViewModeChange('list')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              viewMode === 'list' ? coreColors.background.card : 'transparent',
            color:
              viewMode === 'list'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              viewMode === 'list' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'list') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'list') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('hierarchical')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              viewMode === 'hierarchical'
                ? coreColors.background.card
                : 'transparent',
            color:
              viewMode === 'hierarchical'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              viewMode === 'hierarchical'
                ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                : 'none',
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'hierarchical') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'hierarchical') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </div>

      {/* New Button */}
      {onNew && (
        <button
          onClick={onNew}
          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-xl shadow-sm transition-all duration-200"
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

      {/* Search bar or Filter bar based on mode */}
      {showSearch && searchMode === 'search' && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search agents..."
        />
      )}

      {showSearch && searchMode === 'filter' && (
        <StatusTabs
          stats={stats}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

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
      <div
        className="flex justify-between items-center pt-4 mt-6 border-t"
        style={{ borderColor: coreColors.border.light }}
      >
        <div
          className="flex items-center space-x-2 text-sm"
          style={{ color: coreColors.text.tertiary }}
        >
          <span>{stats.total} agents</span>
          <span>•</span>
          <span>{stats.active} active</span>
        </div>
        <div
          className="flex items-center space-x-2 text-sm"
          style={{ color: coreColors.status.success }}
        >
          <Wifi className="w-4 h-4" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  )
}
