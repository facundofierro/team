'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'
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
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md active:scale-95',
        className
      )}
      style={{
        backgroundColor: elegantColors.primary[500],
        color: elegantColors.text.inverse,
      }}
    >
      {loading ? (
        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
