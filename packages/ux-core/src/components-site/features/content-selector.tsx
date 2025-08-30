import React, { useState } from 'react'
import { cn } from '@teamhub/ux-core/utils'

interface ContentOption {
  id: string
  name: string
  color: string
  features: string[]
  description?: string
}

interface ContentSelectorProps {
  options: ContentOption[]
  selectedOption?: string
  onOptionChange?: (optionId: string) => void
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

export function ContentSelector({
  options,
  selectedOption,
  onOptionChange,
  className,
  variant = 'tabs',
  size = 'md',
  showFeatures = true,
  showDescription = false,
}: ContentSelectorProps) {
  const [activeOption, setActiveOption] = useState(
    selectedOption || options[0]?.id
  )

  const handleOptionChange = (optionId: string) => {
    setActiveOption(optionId)
    onOptionChange?.(optionId)
  }

  const currentOption = options.find(
    (option) => option.id === activeOption
  )

  const renderOption = (option: ContentOption) => {
    const isActive = option.id === activeOption

    if (variant === 'tabs') {
      return (
        <button
          key={option.id}
          onClick={() => handleOptionChange(option.id)}
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
            style={{ backgroundColor: option.color }}
          />
          <span>{option.name}</span>
        </button>
      )
    }

    if (variant === 'buttons') {
      return (
        <button
          key={option.id}
          onClick={() => handleOptionChange(option.id)}
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
            style={{ backgroundColor: option.color }}
          />
          <span className="font-medium text-center">{option.name}</span>
        </button>
      )
    }

    if (variant === 'cards') {
      return (
        <button
          key={option.id}
          onClick={() => handleOptionChange(option.id)}
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
            style={{ backgroundColor: option.color }}
          />
          <span className="font-semibold">{option.name}</span>
          {showDescription && option.description && (
            <p className="text-sm text-teamhub-muted leading-relaxed">
              {option.description}
            </p>
          )}
        </button>
      )
    }

    return null
  }

  return (
    <div className={className}>
      {/* Content Selection */}
      <div className={cn('mb-6', selectorVariants[variant])}>
        {options.map(renderOption)}
      </div>

      {/* Content Features */}
      {showFeatures && currentOption && (
        <div className="bg-white border border-teamhub-border/20 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-teamhub-secondary mb-2">
              {currentOption.name} Features
            </h3>
            {currentOption.description && (
              <p className="text-sm text-teamhub-muted">
                {currentOption.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentOption.features.map((feature, index) => (
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
