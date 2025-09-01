'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { coreColors } from '../light-theme-colors'

export interface ActiveIndicatorProps {
  isActive: boolean
  onToggle: (active: boolean) => void
  disabled?: boolean
  className?: string
}

export function ActiveIndicator({
  isActive,
  onToggle,
  disabled = false,
  className,
}: ActiveIndicatorProps) {
  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      <span
        className="text-sm font-medium"
        style={{ color: coreColors.text.primary }}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
      <button
        onClick={() => !disabled && onToggle(!isActive)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: isActive
            ? coreColors.status.success
            : coreColors.text.disabled,
        }}
      >
        <motion.div
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
          animate={{
            x: isActive ? 20 : 4,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  )
}
