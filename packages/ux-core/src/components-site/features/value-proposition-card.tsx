import React from 'react'
import { cn } from '../../utils/cn'

interface ValuePropositionCardProps {
  title: string
  subtitle?: string
  description: string
  metric?: {
    value: string
    label: string
    color?:
      | 'teamhub-highlight'
      | 'teamhub-accent'
      | 'teamhub-success'
      | 'teamhub-warning'
  }
  icon?: React.ReactNode
  features?: string[]
  ctaText?: string
  onCtaClick?: () => void
  className?: string
  variant?: 'default' | 'elevated' | 'gradient' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const cardVariants = {
  default: 'bg-white border border-teamhub-border/20 shadow-sm',
  elevated:
    'bg-white border border-teamhub-border/20 shadow-lg hover:shadow-xl',
  gradient:
    'bg-gradient-to-br from-teamhub-highlight/10 to-teamhub-accent/10 border border-teamhub-highlight/20 shadow-md',
  outlined: 'bg-transparent border-2 border-teamhub-highlight/30',
}

const cardSizes = {
  sm: 'p-6',
  md: 'p-8',
  lg: 'p-10',
}

const metricColors = {
  'teamhub-highlight': 'text-teamhub-highlight',
  'teamhub-accent': 'text-teamhub-accent',
  'teamhub-success': 'text-teamhub-success',
  'teamhub-warning': 'text-teamhub-warning',
}

export function ValuePropositionCard({
  title,
  subtitle,
  description,
  metric,
  icon,
  features,
  ctaText,
  onCtaClick,
  className,
  variant = 'default',
  size = 'md',
}: ValuePropositionCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl transition-all duration-300 overflow-hidden',
        cardVariants[variant],
        cardSizes[size],
        variant === 'elevated' && 'hover:-translate-y-2',
        className
      )}
    >
      {/* Background Pattern */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,85,132,0.3)_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>
      )}

      {/* Icon */}
      {icon && (
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teamhub-highlight to-teamhub-accent rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-teamhub-secondary mb-2 text-center">
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-teamhub-muted text-center mb-4 text-sm font-medium">
          {subtitle}
        </p>
      )}

      {/* Metric */}
      {metric && (
        <div className="mb-6 text-center">
          <div
            className={cn(
              'text-4xl font-bold mb-1',
              metricColors[metric.color || 'teamhub-highlight']
            )}
          >
            {metric.value}
          </div>
          <div className="text-sm text-teamhub-muted font-medium">
            {metric.label}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-teamhub-muted text-center mb-6 leading-relaxed">
        {description}
      </p>

      {/* Feature List */}
      {features && features.length > 0 && (
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gradient-to-br from-teamhub-success to-teamhub-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-teamhub-secondary leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      {ctaText && onCtaClick && (
        <div className="text-center">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teamhub-highlight to-teamhub-accent text-white font-semibold rounded-lg hover:from-teamhub-accent hover:to-teamhub-highlight transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            {ctaText}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// Compact version for smaller displays
export function CompactValuePropositionCard({
  title,
  description,
  metric,
  icon,
  className,
}: Pick<
  ValuePropositionCardProps,
  'title' | 'description' | 'metric' | 'icon' | 'className'
>) {
  return (
    <div
      className={cn(
        'bg-white border border-teamhub-border/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="w-10 h-10 bg-gradient-to-br from-teamhub-highlight to-teamhub-accent rounded-lg flex items-center justify-center text-white flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-teamhub-secondary text-sm">
              {title}
            </h4>
            {metric && (
              <span
                className={cn(
                  'text-sm font-bold',
                  metricColors[metric.color || 'teamhub-highlight']
                )}
              >
                {metric.value}
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
