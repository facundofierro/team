'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { coreColors, coreUtils } from '../light-theme-colors'

export interface GhostButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function GhostButton({
  children,
  onClick,
  disabled = false,
  icon: Icon,
  className,
}: GhostButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
        'focus:outline-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
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
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </button>
  )
}
