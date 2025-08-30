import React from 'react'
import { cn } from '@/utils'

interface Statistic {
  id: string
  value: string | number
  label: string
  description?: string
  icon?: React.ReactNode
  color?:
    | 'teamhub-hot-pink'
    | 'teamhub-accent'
    | 'teamhub-success'
    | 'teamhub-warning'
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

interface StatisticsProps {
  statistics: Statistic[]
  className?: string
  layout?: 'grid' | 'horizontal' | 'vertical'
  cols?: 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  size?: 'sm' | 'md' | 'lg'
  showIcons?: boolean
  showTrends?: boolean
  centered?: boolean
}

const layoutClasses = {
  grid: 'grid',
  horizontal: 'flex flex-row flex-wrap',
  vertical: 'flex flex-col',
}

const gridCols = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

const gaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

const sizes = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
}

const colors = {
  'teamhub-hot-pink': 'text-teamhub-hot-pink',
  'teamhub-accent': 'text-teamhub-accent',
  'teamhub-success': 'text-teamhub-success',
  'teamhub-warning': 'text-teamhub-warning',
}

const trendIcons = {
  up: (
    <svg
      className="w-4 h-4 text-teamhub-success"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  down: (
    <svg
      className="w-4 h-4 text-teamhub-warning"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    </svg>
  ),
  neutral: (
    <svg
      className="w-4 h-4 text-teamhub-muted"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14"
      />
    </svg>
  ),
}

export function Statistics({
  statistics,
  className,
  layout = 'grid',
  cols = 4,
  gap = 'lg',
  size = 'md',
  showIcons = true,
  showTrends = false,
  centered = true,
}: StatisticsProps) {
  return (
    <div
      className={cn(
        layoutClasses[layout],
        layout === 'grid' && gridCols[cols],
        gaps[gap],
        centered && 'justify-center',
        className
      )}
    >
      {statistics.map((stat) => (
        <div
          key={stat.id}
          className={cn(
            'flex flex-col',
            centered && 'text-center',
            layout === 'horizontal' && 'flex-1 min-w-0'
          )}
        >
          {/* Icon */}
          {showIcons && stat.icon && (
            <div className="mb-3 flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-lg flex items-center justify-center text-white">
                {stat.icon}
              </div>
            </div>
          )}

          {/* Value */}
          <div className="mb-2">
            <span
              className={cn(
                'font-bold',
                sizes[size],
                stat.color && colors[stat.color]
              )}
            >
              {stat.value}
            </span>
          </div>

          {/* Label */}
          <h3 className="text-lg font-semibold text-teamhub-secondary mb-2">
            {stat.label}
          </h3>

          {/* Description */}
          {stat.description && (
            <p className="text-sm text-teamhub-muted leading-relaxed">
              {stat.description}
            </p>
          )}

          {/* Trend */}
          {showTrends && stat.trend && (
            <div className="mt-3 flex items-center space-x-1">
              {trendIcons[stat.trend]}
              {stat.trendValue && (
                <span
                  className={cn(
                    'text-sm font-medium',
                    stat.trend === 'up' && 'text-teamhub-success',
                    stat.trend === 'down' && 'text-teamhub-warning',
                    stat.trend === 'neutral' && 'text-teamhub-muted'
                  )}
                >
                  {stat.trendValue}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Compact Statistics for smaller displays
interface CompactStatisticsProps {
  statistics: Statistic[]
  className?: string
  layout?: 'horizontal' | 'vertical'
  showIcons?: boolean
}

export function CompactStatistics({
  statistics,
  className,
  layout = 'horizontal',
  showIcons = false,
}: CompactStatisticsProps) {
  return (
    <div
      className={cn(
        'flex',
        layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
        'gap-4',
        className
      )}
    >
      {statistics.map((stat) => (
        <div
          key={stat.id}
          className="flex items-center space-x-3 bg-white border border-teamhub-border/20 rounded-lg p-3 shadow-sm"
        >
          {showIcons && stat.icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-lg flex items-center justify-center text-white">
              {stat.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2">
              <span
                className={cn(
                  'text-xl font-bold',
                  stat.color && colors[stat.color]
                )}
              >
                {stat.value}
              </span>
              <span className="text-sm text-teamhub-muted">{stat.label}</span>
            </div>
            {stat.description && (
              <p className="text-xs text-teamhub-muted mt-1">
                {stat.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
