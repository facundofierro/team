'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'
import { RotateCcw } from 'lucide-react'

export interface TertiaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function TertiaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className,
}: TertiaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200',
        'flex items-center space-x-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95',
        className
      )}
      style={{
        backgroundColor: 'transparent',
        color: elegantColors.text.secondary,
      }}
      onMouseEnter={(e) =>
        !disabled &&
        (e.currentTarget.style.backgroundColor =
          elegantColors.interactive.ghostHover)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  )
}

// Pre-configured Reset button
export function ResetButton(
  props: Omit<TertiaryButtonProps, 'children' | 'icon'>
) {
  return (
    <TertiaryButton {...props} icon={RotateCcw}>
      Reset
    </TertiaryButton>
  )
}
