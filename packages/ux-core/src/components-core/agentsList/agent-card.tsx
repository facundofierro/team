import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { coreColors } from '../light-theme-colors'
import type { Agent } from './types'

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
export const AgentCard: React.FC<{
  agent: Agent
  isSelected: boolean
  isChild?: boolean
  onSelect: (agent: Agent) => void
  onExpandToggle?: (agent: Agent) => void
  isExpanded?: boolean
  selectedAgentId?: string
  viewMode?: 'list' | 'hierarchical'
}> = ({
  agent,
  isSelected,
  isChild = false,
  onSelect,
  onExpandToggle,
  isExpanded,
  selectedAgentId,
  viewMode = 'hierarchical',
}) => {
  const hasChildren = agent.children && agent.children.length > 0

  return (
    <div className={`${isChild ? 'ml-6' : ''}`}>
      <button
        onClick={() => onSelect(agent)}
        className={`flex items-center px-4 py-3 space-x-3 w-full rounded-xl border shadow-sm transition-all duration-200 ${
          isSelected ? 'ring-2 ring-offset-2' : ''
        }`}
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
        {/* Expand/collapse button for parent agents - only show in tree mode */}
        {hasChildren && onExpandToggle && (
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

      {/* Child agents - only show in hierarchical mode */}
      {hasChildren && isExpanded && viewMode === 'hierarchical' && (
        <div className="mt-1 space-y-1">
          {agent.children?.map((child) => (
            <AgentCard
              key={child.id}
              agent={child}
              isSelected={selectedAgentId === child.id}
              isChild={true}
              onSelect={onSelect}
              selectedAgentId={selectedAgentId}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
