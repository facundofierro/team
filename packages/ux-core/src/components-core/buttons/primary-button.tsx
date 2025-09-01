'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'
import { Save } from 'lucide-react'

export interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200',
        'flex items-center space-x-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-lg active:scale-95',
        className
      )}
      style={{
        background: elegantColors.background.primaryGradient,
        color: elegantColors.text.inverse,
      }}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  )
}

// Pre-configured Save button
export function SaveButton(
  props: Omit<PrimaryButtonProps, 'children' | 'icon'>
) {
  return (
    <PrimaryButton {...props} icon={Save}>
      Save All Changes
    </PrimaryButton>
  )
}
