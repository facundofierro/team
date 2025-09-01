import React from 'react'
import { Wifi } from 'lucide-react'
import { coreColors } from '../light-theme-colors'
import type { AgentStats } from './types'

// Footer component
export const AgentsFooter: React.FC<{
  stats: AgentStats
}> = ({ stats }) => {
  return (
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
  )
}
