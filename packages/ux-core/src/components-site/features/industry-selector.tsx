import React, { useState } from 'react'
import { cn } from '@/utils'

interface Industry {
  id: string
  name: string
  color: string
  features: string[]
  description?: string
}

interface IndustrySelectorProps {
  industries: Industry[]
  selectedIndustry?: string
  onIndustryChange?: (industryId: string) => void
  className?: string
  variant?: 'tabs' | 'buttons' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  showFeatures?: boolean
  showDescription?: boolean
}

const selectorVariants = {
  tabs: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2',
  buttons: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
  cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
}

const selectorSizes = {
  sm: 'text-sm px-3 py-2',
  md: 'text-base px-4 py-3',
  lg: 'text-lg px-6 py-4',
}

export function IndustrySelector({
  industries,
  selectedIndustry,
  onIndustryChange,
  className,
  variant = 'tabs',
  size = 'md',
  showFeatures = true,
  showDescription = false,
}: IndustrySelectorProps) {
  const [activeIndustry, setActiveIndustry] = useState(
    selectedIndustry || industries[0]?.id
  )

  const handleIndustryChange = (industryId: string) => {
    setActiveIndustry(industryId)
    onIndustryChange?.(industryId)
  }

  const currentIndustry = industries.find(
    (industry) => industry.id === activeIndustry
  )

  const renderIndustryOption = (industry: Industry) => {
    const isActive = industry.id === activeIndustry

    if (variant === 'tabs') {
      return (
        <button
          key={industry.id}
          onClick={() => handleIndustryChange(industry.id)}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
            selectorSizes[size],
            isActive
              ? 'bg-teamhub-primary text-white shadow-md'
              : 'text-teamhub-secondary hover:text-teamhub-primary hover:bg-teamhub-background'
          )}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: industry.color }}
          />
          <span>{industry.name}</span>
        </button>
      )
    }

    if (variant === 'buttons') {
      return (
        <button
          key={industry.id}
          onClick={() => handleIndustryChange(industry.id)}
          className={cn(
            'flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200',
            selectorSizes[size],
            isActive
              ? 'border-teamhub-primary bg-teamhub-primary/5 text-teamhub-primary'
              : 'border-teamhub-border/20 hover:border-teamhub-primary/40 hover:bg-teamhub-background'
          )}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: industry.color }}
          />
          <span className="font-medium text-center">{industry.name}</span>
        </button>
      )
    }

    if (variant === 'cards') {
      return (
        <button
          key={industry.id}
          onClick={() => handleIndustryChange(industry.id)}
          className={cn(
            'flex flex-col items-center space-y-3 p-6 rounded-xl border-2 transition-all duration-200 text-center',
            selectorSizes[size],
            isActive
              ? 'border-teamhub-primary bg-teamhub-primary/5 text-teamhub-primary shadow-lg'
              : 'border-teamhub-border/20 hover:border-teamhub-primary/40 hover:bg-teamhub-background'
          )}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: industry.color }}
          />
          <span className="font-semibold">{industry.name}</span>
          {showDescription && industry.description && (
            <p className="text-sm text-teamhub-muted leading-relaxed">
              {industry.description}
            </p>
          )}
        </button>
      )
    }

    return null
  }

  return (
    <div className={className}>
      {/* Industry Selection */}
      <div className={cn('mb-6', selectorVariants[variant])}>
        {industries.map(renderIndustryOption)}
      </div>

      {/* Industry Features */}
      {showFeatures && currentIndustry && (
        <div className="bg-white border border-teamhub-border/20 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-teamhub-secondary mb-2">
              {currentIndustry.name} Features
            </h3>
            {currentIndustry.description && (
              <p className="text-teamhub-muted text-sm">
                {currentIndustry.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentIndustry.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-teamhub-success flex-shrink-0 mt-0.5"
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
                <span className="text-sm text-teamhub-secondary">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
