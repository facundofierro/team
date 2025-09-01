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
import { AgentCard } from './agent-card'
import { StatusTabs } from './status-tabs'
import { SearchBar } from './search-bar'
import { ActionButtons } from './action-buttons'
import { AgentsFooter } from './agents-footer'
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

    // In list mode, flatten the hierarchy to show all agents at the same level
    if (viewMode === 'list') {
      const flattened: Agent[] = []
      const flattenAgents = (agentList: Agent[]) => {
        agentList.forEach((agent) => {
          flattened.push(agent)
          if (agent.children && agent.children.length > 0) {
            flattenAgents(agent.children)
          }
        })
      }
      flattenAgents(filtered)
      return flattened
    }

    return filtered
  }, [agents, searchQuery, activeTab, viewMode])

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

      {/* Separator line after header */}
      <div
        className="mb-4 -mx-6"
        style={{
          borderBottom: `1px solid ${coreColors.border.light}`,
        }}
      />

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

      {/* Separator line after filter bar */}
      {showSearch && (
        <div
          className="mb-4 -mx-6"
          style={{
            borderBottom: `1px solid ${coreColors.border.light}`,
          }}
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
            onExpandToggle={
              showHierarchical && viewMode === 'hierarchical'
                ? handleExpandToggle
                : undefined
            }
            isExpanded={expandedAgents.has(agent.id)}
            selectedAgentId={selectedAgentId}
          />
        ))}
      </div>

      {/* Separator line before footer */}
      <div
        className="mt-6 mb-4 -mx-6"
        style={{
          borderTop: `1px solid ${coreColors.border.light}`,
        }}
      />

      {/* Footer */}
      <div className="flex justify-between items-center">
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
