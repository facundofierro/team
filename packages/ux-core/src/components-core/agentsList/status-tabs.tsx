import React from 'react'
import { coreColors } from '../light-theme-colors'
import type { AgentStats, StatusTab } from './types'

// Status tabs component
export const StatusTabs: React.FC<{
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
              activeTab === tab.key
                ? coreColors.background.secondary
                : 'transparent',
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
          <span>{tab.label}</span>
          <span style={{ opacity: 0.75 }}>({tab.count})</span>
        </button>
      ))}
    </div>
  )
}
