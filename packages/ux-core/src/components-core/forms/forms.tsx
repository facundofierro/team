'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'
import { Input } from '../../components/shadcn/input'
import { Label } from '../../components/shadcn/label'
import { Button } from '../../components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/shadcn/card'
import { Badge } from '../../components/shadcn/badge'
import { Separator } from '../../components/shadcn/separator'
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
  Save,
  RotateCcw,
} from 'lucide-react'

// Form section component
export interface FormSectionProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}

export function FormSection({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
}: FormSectionProps) {
  return (
    <Card className={cn('bg-white border-gray-200', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

// Enhanced input component
export interface EnhancedInputProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'url'
  maxLength?: number
  showCount?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function EnhancedInput({
  label,
  placeholder,
  value = '',
  onChange,
  error,
  required = false,
  disabled = false,
  type = 'text',
  maxLength,
  showCount = false,
  icon: Icon,
  className,
}: EnhancedInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-xs font-medium" style={{ color: '#5A365C' }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(Icon && 'pl-10', 'px-3 py-2 rounded-lg border text-sm')}
          style={{
            backgroundColor: '#F4F3F5',
            borderColor: 'rgba(195, 192, 198, 0.8)',
            color: '#2D1B2E',
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
        {showCount && maxLength && (
          <span
            className={cn(
              'text-sm',
              value.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

// Enhanced select component
export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface EnhancedSelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function EnhancedSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className,
}: EnhancedSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 text-left border rounded-md bg-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#8A548C] focus:ring-[#8A548C]',
            disabled && 'bg-gray-50 cursor-not-allowed',
            'flex items-center justify-between'
          )}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4 text-gray-400" />}
            <span
              className={selectedOption ? 'text-gray-900' : 'text-gray-500'}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2 border-b border-gray-200">
              <Input
                placeholder="Search options..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border-gray-200 focus:border-[#8A548C] focus:ring-[#8A548C]"
              />
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value)
                    setIsOpen(false)
                    setSearchValue('')
                  }}
                  disabled={option.disabled}
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50',
                    'focus:outline-none',
                    option.value === value &&
                      'bg-[#8A548C] text-white hover:bg-[#7A448C]',
                    option.disabled && 'text-gray-400 cursor-not-allowed'
                  )}
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div
                        className={cn(
                          'text-sm',
                          option.value === value
                            ? 'text-white/80'
                            : 'text-gray-500'
                        )}
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// Toggle switch component
export interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
}: ToggleProps) {
  const sizeClasses = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  }

  const dotSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          sizeClasses[size],
          checked
            ? 'bg-[#8A548C] focus:ring-[#8A548C]'
            : 'bg-gray-200 focus:ring-gray-500',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white shadow transform transition-transform',
            dotSizeClasses[size],
            checked ? 'translate-x-full' : 'translate-x-0'
          )}
          style={{
            transform: checked
              ? `translateX(${
                  size === 'sm' ? '16px' : size === 'md' ? '20px' : '28px'
                })`
              : 'translateX(2px)',
          }}
        />
      </button>
    </div>
  )
}

// Schedule item component
export interface ScheduleItemProps {
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

export function ScheduleItem({
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
}: ScheduleItemProps) {
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
      className={cn(
        'flex items-center justify-between p-4 border border-gray-200 rounded-lg',
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn('w-2 h-2 rounded-full', getStatusColor(status))} />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{frequency}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Next: {nextExecution}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        >
          {status === 'active' ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Tool assignment component
export interface ToolItemProps {
  id: string
  name: string
  description: string
  type: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onRemove: () => void
  className?: string
}

export function ToolItem({
  id,
  name,
  description,
  type,
  enabled,
  onToggle,
  onRemove,
  className,
}: ToolItemProps) {
  const getToolIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'api':
        return <Globe className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 border border-gray-200 rounded-lg',
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-gray-300 text-[#8A548C] focus:ring-[#8A548C]"
        />
        <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
          {getToolIcon(type)}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Form actions component
export interface FormActionsProps {
  onSave?: () => void
  onCancel?: () => void
  onReset?: () => void
  saveLabel?: string
  cancelLabel?: string
  resetLabel?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function FormActions({
  onSave,
  onCancel,
  onReset,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  loading = false,
  disabled = false,
  className,
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-3', className)}>
      {onReset && (
        <button
          onClick={onReset}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            color: elegantColors.primary[800],
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = elegantColors.primary[50])
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetLabel}</span>
        </button>
      )}
      {onCancel && (
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            color: elegantColors.primary[800],
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = elegantColors.primary[50])
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <span>{cancelLabel}</span>
        </button>
      )}
      {onSave && (
        <button
          onClick={onSave}
          disabled={disabled || loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: elegantColors.background.primaryGradient,
            color: elegantColors.text.inverse,
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Save className="w-4 h-4" />
          <span>{saveLabel}</span>
        </button>
      )}
    </div>
  )
}
