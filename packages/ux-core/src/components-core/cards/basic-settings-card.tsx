'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { ConfigurationCard } from '../configuration-cards'
import { EnhancedInput } from '../forms'

export interface BasicSettingsCardProps {
  agentName: string
  onAgentNameChange: (value: string) => void
  roleType: string
  onRoleTypeChange: (value: string) => void
  className?: string
}

export function BasicSettingsCard({
  agentName,
  onAgentNameChange,
  roleType,
  onRoleTypeChange,
  className,
}: BasicSettingsCardProps) {
  return (
    <ConfigurationCard title="Basic Settings" className={className}>
      <div className="space-y-4">
        <EnhancedInput
          label="Agent Name"
          value={agentName}
          onChange={onAgentNameChange}
          placeholder="Enter agent name"
          required
        />
        <EnhancedInput
          label="Role/Type"
          value={roleType}
          onChange={onRoleTypeChange}
          placeholder="Enter role or type"
          required
        />
      </div>
    </ConfigurationCard>
  )
}
