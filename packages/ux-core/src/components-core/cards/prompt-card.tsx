'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { ConfigurationCard, PromptEditor } from '../configuration-cards'

export interface PromptCardProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  className?: string
}

export function PromptCard({
  value,
  onChange,
  maxLength = 4000,
  placeholder = 'Enter your prompt here...',
  className,
}: PromptCardProps) {
  return (
    <ConfigurationCard title="Prompt" className={className}>
      <PromptEditor
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </ConfigurationCard>
  )
}
