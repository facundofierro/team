'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { coreColors, coreUtils } from '../light-theme-colors'
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
        'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
        'flex items-center space-x-2',
        'focus:outline-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95',
        className
      )}
      style={{
        ...coreUtils.getButtonDefault('ghost'),
      }}
      onFocus={(e) => {}}
      onBlur={(e) =>
        Object.assign(
          e.currentTarget.style,
          coreUtils.getButtonDefault('ghost')
        )
      }
      onMouseEnter={(e) =>
        !disabled &&
        Object.assign(e.currentTarget.style, coreUtils.getButtonHover('ghost'))
      }
      onMouseLeave={(e) =>
        Object.assign(
          e.currentTarget.style,
          coreUtils.getButtonDefault('ghost')
        )
      }
    >
      {loading ? (
        <div className="w-4 h-4 rounded-full border-2 border-gray-400 animate-spin border-t-transparent" />
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
