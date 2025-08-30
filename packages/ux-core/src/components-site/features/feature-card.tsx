import React from 'react'
import { cn } from '../../utils'

interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  metric?: string
  metricColor?:
    | 'teamhub-hot-pink'
    | 'teamhub-accent'
    | 'teamhub-success'
    | 'teamhub-warning'
  description: string
  features?: string[]
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

const cardVariants = {
  default: 'bg-white border border-teamhub-border/20 shadow-sm',
  elevated:
    'bg-white border border-teamhub-border/20 shadow-lg hover:shadow-xl',
  outlined: 'bg-transparent border-2 border-teamhub-highlight/30',
  gradient:
    'bg-gradient-to-br from-teamhub-highlight/5 to-teamhub-accent/5 border border-teamhub-highlight/20 shadow-md',
}

const cardSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const metricColors = {
  'teamhub-hot-pink': 'text-teamhub-hot-pink',
  'teamhub-accent': 'text-teamhub-accent',
  'teamhub-success': 'text-teamhub-success',
  'teamhub-warning': 'text-teamhub-warning',
}

export function FeatureCard({
  icon,
  title,
  metric,
  metricColor = 'teamhub-hot-pink',
  description,
  features,
  className,
  variant = 'default',
  size = 'md',
  hover = true,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        cardVariants[variant],
        cardSizes[size],
        hover && 'hover:scale-105 hover:-translate-y-1',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teamhub-highlight to-teamhub-accent rounded-lg flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-teamhub-secondary mb-3 text-center">
        {title}
      </h3>

      {/* Metric */}
      {metric && (
        <div className="mb-4 text-center">
          <span className={cn('text-2xl font-bold', metricColors[metricColor])}>
            {metric}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-teamhub-muted text-center mb-6 leading-relaxed">
        {description}
      </p>

      {/* Feature List */}
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-teamhub-success flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-teamhub-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Compact Feature Card for smaller displays
interface CompactFeatureCardProps {
  icon?: React.ReactNode
  title: string
  metric?: string
  metricColor?:
    | 'teamhub-hot-pink'
    | 'teamhub-accent'
    | 'teamhub-success'
    | 'teamhub-warning'
  description: string
  className?: string
}

export function CompactFeatureCard({
  icon,
  title,
  metric,
  metricColor = 'teamhub-hot-pink',
  description,
  className,
}: CompactFeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-teamhub-border/20 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="w-8 h-8 bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-lg flex items-center justify-center text-white flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-teamhub-secondary text-sm">
              {title}
            </h4>
            {metric && (
              <span
                className={cn('text-sm font-bold', metricColors[metricColor])}
              >
                {metric}
              </span>
            )}
          </div>
          <p className="text-xs text-teamhub-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
