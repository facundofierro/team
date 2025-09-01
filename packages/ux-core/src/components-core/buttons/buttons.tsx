'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'
import { Button as ShadcnButton } from '../../components/shadcn/button'
import { Save, RotateCcw, Plus } from 'lucide-react'

// Primary Button with Gradient Background (Save All Changes)
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

// Action Button with Solid Background (Add Tool, Add Schedule)
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

// Tertiary Button with Outline (Reset)
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
        'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200',
        'flex items-center space-x-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-50 active:scale-95',
        className
      )}
      style={{
        backgroundColor: elegantColors.background.tertiary,
        borderColor: elegantColors.border.light,
        color: elegantColors.text.primary,
        border: '1px solid',
      }}
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

// Ghost Button for header actions (AI, Templates)
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
        color: elegantColors.text.secondary,
        backgroundColor: 'transparent',
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
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </button>
  )
}

// Pre-configured button components for common use cases
export function SaveButton(
  props: Omit<PrimaryButtonProps, 'children' | 'icon'>
) {
  return (
    <PrimaryButton {...props} icon={Save}>
      Save All Changes
    </PrimaryButton>
  )
}

export function ResetButton(
  props: Omit<TertiaryButtonProps, 'children' | 'icon'>
) {
  return (
    <TertiaryButton {...props} icon={RotateCcw}>
      Reset
    </TertiaryButton>
  )
}

export function AddButton({
  children,
  ...props
}: Omit<ActionButtonProps, 'icon'>) {
  return (
    <ActionButton {...props} icon={Plus}>
      + {children}
    </ActionButton>
  )
}
