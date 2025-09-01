'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { ConfigurationCard, SecurityAccess } from '../configuration-cards'
import { Shield } from 'lucide-react'

export interface SecurityAccessCardProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  className?: string
}

export function SecurityAccessCard({
  value,
  onChange,
  options,
  className,
}: SecurityAccessCardProps) {
  return (
    <ConfigurationCard
      title="Security & Access"
      icon={Shield}
      className={className}
    >
      <SecurityAccess value={value} onChange={onChange} options={options} />
    </ConfigurationCard>
  )
}
