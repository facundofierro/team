import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ActiveIndicatorProps {
  isActive: boolean
  className?: string
  activeText?: string
  inactiveText?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dot' | 'toggle'
  onToggle?: (isActive: boolean) => void
}

export function ActiveIndicator({
  isActive,
  className,
  activeText = 'active',
  inactiveText = 'inactive',
  showText = true,
  size = 'md',
  variant = 'toggle',
  onToggle,
}: ActiveIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const toggleSizeClasses = {
    sm: 'w-8 h-5',
    md: 'w-12 h-7',
    lg: 'w-16 h-9',
  }

  const toggleDotSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isActive)
    }
  }

  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div
          className={cn('rounded-full transition-colors', sizeClasses[size])}
          style={{
            backgroundColor: isActive ? '#22C55E' : '#9B8FA7',
          }}
        />
        {showText && (
          <span
            className={cn(
              'font-medium transition-colors',
              textSizeClasses[size]
            )}
            style={{
              color: isActive ? '#22C55E' : '#9B8FA7',
            }}
          >
            {isActive ? activeText : inactiveText}
          </span>
        )}
      </div>
    )
  }

  // Toggle variant (the beautiful one!)
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {showText && (
        <span
          className={cn('font-medium transition-colors', textSizeClasses[size])}
          style={{
            color: isActive ? '#16A34A' : '#847F8A',
          }}
        >
          {isActive ? activeText : inactiveText}
        </span>
      )}
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300',
          toggleSizeClasses[size]
        )}
        style={{
          backgroundColor: isActive ? '#22C55E' : '#C3C0C6',
        }}
        disabled={!onToggle}
      >
        <motion.div
          className={cn(
            'bg-white rounded-full shadow-md',
            toggleDotSizeClasses[size]
          )}
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
          initial={{
            x: isActive ? '1.25rem' : '0rem',
          }}
          animate={{
            x: isActive ? '1.25rem' : '0rem',
          }}
        />
      </button>
    </div>
  )
}
