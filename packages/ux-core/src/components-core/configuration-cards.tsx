'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { Button } from '../components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/shadcn/card'
import { Badge } from '../components/shadcn/badge'
import { Separator } from '../components/shadcn/separator'
import {
  Plus,
  X,
  Calendar,
  Clock,
  Settings,
  Shield,
  User,
  Users,
  Lock,
  Globe,
  Database,
  FileText,
  Wrench,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Edit3,
  Trash2,
  Sparkles,
  ChevronDown,
  Bot,
  Check,
} from 'lucide-react'

// Title with subtitle component (for header)
export interface TitleWithSubtitleProps {
  title: string
  subtitle?: string
  status?: 'active' | 'inactive' | 'paused'
  onStatusChange?: (status: 'active' | 'inactive' | 'paused') => void
  className?: string
}

export function TitleWithSubtitle({
  title,
  subtitle,
  status,
  onStatusChange,
  className,
}: TitleWithSubtitleProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-gray-400'
      case 'paused':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#2D1B2E' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: '#5A365C' }}>
            {subtitle}
          </p>
        )}
      </div>
      {status && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={cn('w-2 h-2 rounded-full', getStatusColor(status))}
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {status}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onStatusChange?.(status === 'active' ? 'inactive' : 'active')
            }
            className="h-8 w-8 p-0"
          >
            {status === 'active' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Pause className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

// Configuration card component (generic)
export interface ConfigurationCardProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  headerAction?: React.ReactNode
  headerContent?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function ConfigurationCard({
  title,
  subtitle,
  icon: Icon,
  children,
  headerAction,
  headerContent,
  footer,
  className,
}: ConfigurationCardProps) {
  return (
    <div
      className={cn('p-4 rounded-xl border', className)}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(215, 213, 217, 0.6)',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-50">
              <Icon className="h-5 w-5" style={{ color: '#8A548C' }} />
            </div>
          )}
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: '#2D1B2E' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {headerAction && (
          <div className="flex items-center space-x-2">{headerAction}</div>
        )}
        {headerContent && <div>{headerContent}</div>}
      </div>
      <div className="space-y-3">{children}</div>
      {footer && (
        <div
          className="mt-4 pt-3 border-t"
          style={{ borderColor: 'rgba(215, 213, 217, 0.6)' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

// Button variants for configuration
export interface ConfigButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function ConfigButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  onClick,
  disabled = false,
  className,
}: ConfigButtonProps) {
  const baseClasses =
    'inline-flex items-center space-x-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-[#8A548C] text-white hover:bg-[#7A448C] focus:ring-[#8A548C]',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  }

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-3 py-2 text-sm rounded-md',
    lg: 'px-4 py-2.5 text-base rounded-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </button>
  )
}

// Scheduled execution item component
export interface ScheduledExecutionItemProps {
  id: string
  title: string
  description: string
  nextExecution: string
  frequency: string
  status: 'active' | 'inactive' | 'paused'
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: () => void
  className?: string
}

export function ScheduledExecutionItem({
  id,
  title,
  description,
  nextExecution,
  frequency,
  status,
  onEdit,
  onDelete,
  onToggle,
  className,
}: ScheduledExecutionItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-gray-400'
      case 'paused':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div
      className={cn('p-3 rounded-lg border transition-all', className)}
      style={{
        backgroundColor:
          status === 'active' ? 'rgba(138, 84, 140, 0.12)' : '#F4F3F5',
        borderColor:
          status === 'active'
            ? 'rgba(138, 84, 140, 0.3)'
            : 'rgba(215, 213, 217, 0.6)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              status === 'active' ? 'animate-pulse' : ''
            )}
            style={{
              backgroundColor: status === 'active' ? '#22C55E' : '#9B8FA7',
            }}
          />
          <span className="text-xs font-medium" style={{ color: '#5A365C' }}>
            {frequency}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onToggle}
            className="p-1 rounded transition-colors"
            style={{ color: '#847F8A' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            {status === 'active' ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-1 rounded transition-colors"
            style={{ color: '#847F8A' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded transition-colors"
            style={{ color: '#847F8A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2'
              e.currentTarget.style.color = '#DC2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#847F8A'
            }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-2" style={{ color: '#2D1B2E' }}>
        {description}
      </p>
      <div
        className="flex items-center space-x-2 text-xs"
        style={{ color: '#847F8A' }}
      >
        <Calendar className="w-3 h-3" />
        <span>Next: {nextExecution}</span>
      </div>
    </div>
  )
}

// Tool assignment item component
export interface ToolAssignmentItemProps {
  id: string
  name: string
  description: string
  type: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onRemove: () => void
  className?: string
}

export function ToolAssignmentItem({
  id,
  name,
  description,
  type,
  enabled,
  onToggle,
  onRemove,
  className,
}: ToolAssignmentItemProps) {
  const getToolIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'api':
        return <Globe className="h-4 w-4" />
      case 'calculator':
        return <Wrench className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  return (
    <div
      className={cn('flex items-start space-x-2.5 p-2.5 rounded-lg', className)}
      style={{
        backgroundColor: 'rgba(138, 84, 140, 0.12)',
      }}
    >
      <div
        className="w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center"
        style={{
          borderColor: '#8A548C',
          backgroundColor: '#8A548C',
        }}
      >
        <Check className="w-2.5 h-2.5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="p-1.5 rounded-lg" style={{ color: '#5A365C' }}>
              {getToolIcon(type)}
            </div>
            <p className="text-xs font-medium" style={{ color: '#2D1B2E' }}>
              {name}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 rounded transition-colors"
            style={{ color: '#847F8A' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: '#847F8A' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

// Prompt editor component
export interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  className?: string
}

export function PromptEditor({
  value,
  onChange,
  maxLength = 4000,
  placeholder = 'Enter your prompt here...',
  className,
}: PromptEditorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full min-h-32 p-3 rounded-lg border text-sm resize-none leading-relaxed"
        style={{
          backgroundColor: '#F4F3F5',
          borderColor: 'rgba(195, 192, 198, 0.8)',
          color: '#2D1B2E',
          height: Math.max(128, Math.min(256, value.length * 0.5 + 80)) + 'px',
        }}
      />
      <div className="text-right text-xs" style={{ color: '#847F8A' }}>
        <span>
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  )
}

// Security and access component
export interface SecurityAccessProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  className?: string
}

export function SecurityAccess({
  value,
  onChange,
  options,
  className,
}: SecurityAccessProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-gray-600" />
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            User Role Permissions
          </h4>
          <p className="text-xs text-gray-600">
            Define which user roles can manage this agent.
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#8A548C] focus:border-[#8A548C] flex items-center justify-between"
        >
          <span className="text-sm text-gray-900">
            {selectedOption ? selectedOption.label : 'Select permission level'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
