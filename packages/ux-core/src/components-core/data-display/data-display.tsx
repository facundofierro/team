'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/shadcn/card'
import { Badge } from '../../components/shadcn/badge'
import { Button } from '../../components/shadcn/button'
import { Separator } from '../../components/shadcn/separator'
import {
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings,
  Play,
  Pause,
} from 'lucide-react'

// Icon wrapper to resolve type compatibility issues
const IconWrapper = ({
  icon: Icon,
  ...props
}: {
  icon: any
  [key: string]: any
}) => {
  return <Icon {...props} />
}

// Status indicator component
export interface StatusIndicatorProps {
  status:
    | 'active'
    | 'inactive'
    | 'running'
    | 'stopped'
    | 'error'
    | 'warning'
    | 'pending'
    | 'idle'
    | 'offline'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return {
          color: 'bg-elegant-success',
          label: 'Active',
          icon: CheckCircle,
          textColor: 'text-elegant-success',
          bgColor: 'bg-elegant-status-success-50',
          borderColor: 'border-elegant-success',
        }
      case 'inactive':
      case 'stopped':
        return {
          color: 'bg-elegant-neutral',
          label: 'Inactive',
          icon: XCircle,
          textColor: 'text-elegant-neutral',
          bgColor: 'bg-elegant-neutral-50',
          borderColor: 'border-elegant-neutral',
        }
      case 'error':
        return {
          color: 'bg-elegant-error',
          label: 'Error',
          icon: AlertCircle,
          textColor: 'text-elegant-error',
          bgColor: 'bg-elegant-status-error-50',
          borderColor: 'border-elegant-error',
        }
      case 'warning':
        return {
          color: 'bg-elegant-warning',
          label: 'Warning',
          icon: AlertCircle,
          textColor: 'text-elegant-warning',
          bgColor: 'bg-elegant-status-warning-50',
          borderColor: 'border-elegant-warning',
        }
      case 'pending':
        return {
          color: 'bg-elegant-status-info-500',
          label: 'Pending',
          icon: Clock,
          textColor: 'text-elegant-status-info-600',
          bgColor: 'bg-elegant-status-info-50',
          borderColor: 'border-elegant-status-info-500',
        }
      case 'idle':
        return {
          color: 'bg-elegant-highlight',
          label: 'Idle',
          icon: Clock,
          textColor: 'text-elegant-highlight',
          bgColor: 'bg-elegant-accent-yellow/10',
          borderColor: 'border-elegant-highlight',
        }
      case 'offline':
        return {
          color: 'bg-elegant-neutral',
          label: 'Offline',
          icon: XCircle,
          textColor: 'text-elegant-neutral',
          bgColor: 'bg-elegant-neutral-50',
          borderColor: 'border-elegant-neutral',
        }
      default:
        return {
          color: 'bg-elegant-neutral',
          label: 'Unknown',
          icon: XCircle,
          textColor: 'text-elegant-neutral',
          bgColor: 'bg-elegant-neutral-50',
          borderColor: 'border-elegant-neutral',
        }
    }
  }

  const {
    color,
    label,
    icon: Icon,
    textColor,
    bgColor,
    borderColor,
  } = getStatusConfig(status)
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('rounded-full', color, sizeClasses[size])} />
      {showLabel && (
        <span className={cn('text-sm font-medium', textColor)}>{label}</span>
      )}
    </div>
  )
}

// Agent card component
export interface AgentCardProps {
  id: string
  title: string
  description: string
  status: StatusIndicatorProps['status']
  type?: string
  lastActive?: string
  metrics?: {
    cost?: string
    responseTime?: string
    successRate?: string
  }
  actions?: {
    onEdit?: () => void
    onDelete?: () => void
    onView?: () => void
    onSettings?: () => void
    onToggle?: () => void
  }
  selected?: boolean
  className?: string
}

export function AgentCard({
  id,
  title,
  description,
  status,
  type,
  lastActive,
  metrics,
  actions,
  selected = false,
  className,
}: AgentCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        selected && 'ring-2 ring-[#8A548C] bg-purple-50',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <StatusIndicator status={status} size="sm" />
              <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>

            {type && (
              <Badge
                variant="secondary"
                className="mb-2 bg-gray-100 text-gray-700"
              >
                {type}
              </Badge>
            )}

            {metrics && (
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                {metrics.cost && (
                  <div>
                    <span className="font-medium">Cost:</span> {metrics.cost}
                  </div>
                )}
                {metrics.responseTime && (
                  <div>
                    <span className="font-medium">Response:</span>{' '}
                    {metrics.responseTime}
                  </div>
                )}
                {metrics.successRate && (
                  <div>
                    <span className="font-medium">Success:</span>{' '}
                    {metrics.successRate}
                  </div>
                )}
              </div>
            )}

            {lastActive && (
              <p className="text-xs text-gray-400 mt-2">
                Last active: {lastActive}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.onToggle?.()
                }}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                {status === 'active' || status === 'running' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.onSettings?.()
                }}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.onEdit?.()
                }}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Metrics card component
export interface MetricCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  variant = 'default',
  className,
}: MetricCardProps) {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className={cn('bg-white', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1 mt-2">
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-sm text-gray-500">vs {trend.period}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'p-3 rounded-lg bg-gray-50',
                getVariantStyles(variant)
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Data table component
export interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  sortable?: boolean
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: keyof T) => void
  onRowClick?: (item: T) => void
  selectedRows?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  className?: string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  sortBy,
  sortDirection,
  onSort,
  onRowClick,
  selectedRows,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key)
    }
  }

  const handleRowSelection = (id: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = new Set(selectedRows || [])
      if (checked) {
        newSelection.add(id)
      } else {
        newSelection.delete(id)
      }
      onSelectionChange(newSelection)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange(new Set(data.map((item) => item.id)))
      } else {
        onSelectionChange(new Set())
      }
    }
  }

  return (
    <div className={cn('bg-white rounded-lg border', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows?.size === data.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-[#8A548C] focus:ring-[#8A548C]"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-gray-700',
                    column.sortable && 'cursor-pointer hover:bg-gray-100',
                    column.width
                  )}
                  onClick={() =>
                    column.sortable && handleSort(column.key as keyof T)
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortBy === column.key && (
                      <span className="text-[#8A548C]">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {onSelectionChange && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows?.has(item.id) || false}
                      onChange={(e) =>
                        handleRowSelection(item.id, e.target.checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-[#8A548C] focus:ring-[#8A548C]"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(item[column.key as keyof T], item)
                      : String(item[column.key as keyof T] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// List component
export interface ListItemProps {
  id: string
  title: string
  description?: string
  subtitle?: string
  status?: StatusIndicatorProps['status']
  actions?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function ListItem({
  id,
  title,
  description,
  subtitle,
  status,
  actions,
  selected = false,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0',
        'hover:bg-gray-50 transition-colors cursor-pointer',
        selected && 'bg-purple-50 border-purple-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {status && <StatusIndicator status={status} size="sm" />}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600 truncate">{description}</p>
          )}
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center space-x-2 ml-4">{actions}</div>
      )}
    </div>
  )
}

// Empty state component
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Icon className="h-full w-full" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
          className="bg-[#8A548C] hover:bg-[#7A448C] text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
