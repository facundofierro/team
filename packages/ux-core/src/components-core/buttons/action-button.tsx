'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { coreColors, coreUtils } from '../light-theme-colors'
import { Plus } from 'lucide-react'

export interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function ActionButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-3 py-1 rounded-md font-medium text-sm transition-all duration-200',
        'flex items-center space-x-1.5',
        'focus:outline-none',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md active:scale-95',
        className
      )}
      style={{
        ...coreUtils.getButtonDefault('action'),
        ...coreUtils.getFocusStyles(),
      }}
    >
      {loading ? (
        <div className="w-3 h-3 rounded-full border-2 border-white animate-spin border-t-transparent" />
      ) : (
        Icon && <Icon className="w-3 h-3" />
      )}
      <span>{children}</span>
    </button>
  )
}

// Pre-configured Add button
export function AddButton({
  children,
  ...props
}: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton {...props} icon={Plus}>
      {children}
    </ActionButton>
  )
}
