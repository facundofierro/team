'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { coreColors, coreUtils } from '../light-theme-colors'
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
        'focus:outline-none',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-lg active:scale-95',
        className
      )}
      style={{
        ...coreUtils.getButtonDefault('primary'),
      }}
      onFocus={(e) =>
        Object.assign(e.currentTarget.style, {
          ...coreUtils.getButtonDefault('primary'),
          ...coreUtils.getFocusStyles(),
        })
      }
      onBlur={(e) =>
        Object.assign(
          e.currentTarget.style,
          coreUtils.getButtonDefault('primary')
        )
      }
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
