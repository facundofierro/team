import React, { useState } from 'react'
import { cn } from '@/utils'

interface IndustryTab {
  id: string
  name: string
  icon?: React.ReactNode
  description?: string
  content: React.ReactNode
}

interface IndustryTabSelectorProps {
  tabs: IndustryTab[]
  defaultTab?: string
  className?: string
  tabClassName?: string
  contentClassName?: string
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  onTabChange?: (tabId: string) => void
  showDescription?: boolean
  animated?: boolean
}

const tabVariants = {
  default: 'border-b-2 border-transparent hover:border-teamhub-highlight/30',
  pills: 'rounded-full px-4 py-2 hover:bg-teamhub-highlight/10',
  underline: 'border-b-2 border-transparent hover:border-teamhub-highlight',
  cards:
    'border border-transparent hover:border-teamhub-highlight/30 rounded-lg p-3 hover:bg-teamhub-highlight/5',
}

const tabSizes = {
  sm: 'text-sm px-3 py-2',
  md: 'text-base px-4 py-3',
  lg: 'text-lg px-6 py-4',
}

export function IndustryTabSelector({
  tabs,
  defaultTab,
  className,
  tabClassName,
  contentClassName,
  variant = 'default',
  size = 'md',
  onTabChange,
  showDescription = false,
  animated = true,
}: IndustryTabSelectorProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 font-medium transition-all duration-300 cursor-pointer',
                tabVariants[variant],
                tabSizes[size],
                isActive
                  ? variant === 'default'
                    ? 'border-teamhub-highlight text-teamhub-highlight'
                    : variant === 'pills'
                    ? 'bg-teamhub-highlight text-white'
                    : variant === 'underline'
                    ? 'border-teamhub-highlight text-teamhub-highlight'
                    : 'border-teamhub-highlight bg-teamhub-highlight/10 text-teamhub-highlight'
                  : 'text-teamhub-muted hover:text-teamhub-secondary',
                tabClassName
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Description */}
      {showDescription && activeTabData?.description && (
        <div className="text-center mb-8">
          <p className="text-lg text-teamhub-muted max-w-2xl mx-auto">
            {activeTabData.description}
          </p>
        </div>
      )}

      {/* Tab Content */}
      <div className={cn('relative', contentClassName)}>
        {animated ? (
          <div
            key={activeTab}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
          >
            {activeTabData?.content}
          </div>
        ) : (
          activeTabData?.content
        )}
      </div>
    </div>
  )
}

// Specialized industry selector for automation features
interface AutomationIndustrySelectorProps {
  industries: {
    id: string
    name: string
    icon: React.ReactNode
    description: string
    features: string[]
    metrics: {
      efficiency: string
      costSavings: string
      timeReduction: string
    }
  }[]
  className?: string
}

export function AutomationIndustrySelector({
  industries,
  className,
}: AutomationIndustrySelectorProps) {
  const tabs = industries.map((industry) => ({
    id: industry.id,
    name: industry.name,
    icon: industry.icon,
    description: industry.description,
    content: (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Efficiency Metrics */}
        <div className="bg-gradient-to-br from-teamhub-highlight/10 to-teamhub-accent/10 border border-teamhub-highlight/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teamhub-highlight to-teamhub-accent rounded-lg flex items-center justify-center text-white mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-teamhub-secondary mb-2">
            Efficiency Gain
          </h4>
          <p className="text-3xl font-bold text-teamhub-highlight mb-2">
            {industry.metrics.efficiency}
          </p>
          <p className="text-sm text-teamhub-muted">Average improvement</p>
        </div>

        {/* Cost Savings */}
        <div className="bg-gradient-to-br from-teamhub-success/10 to-teamhub-accent/10 border border-teamhub-success/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teamhub-success to-teamhub-accent rounded-lg flex items-center justify-center text-white mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-teamhub-secondary mb-2">
            Cost Savings
          </h4>
          <p className="text-3xl font-bold text-teamhub-success mb-2">
            {industry.metrics.costSavings}
          </p>
          <p className="text-sm text-teamhub-muted">Annual reduction</p>
        </div>

        {/* Time Reduction */}
        <div className="bg-gradient-to-br from-teamhub-accent/10 to-teamhub-primary/10 border border-teamhub-accent/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teamhub-accent to-teamhub-primary rounded-lg flex items-center justify-center text-white mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-teamhub-secondary mb-2">
            Time Reduction
          </h4>
          <p className="text-3xl font-bold text-teamhub-accent mb-2">
            {industry.metrics.timeReduction}
          </p>
          <p className="text-sm text-teamhub-muted">Faster execution</p>
        </div>
      </div>
    ),
  }))

  return (
    <IndustryTabSelector
      tabs={tabs}
      variant="pills"
      size="lg"
      showDescription={true}
      animated={true}
      className={className}
    />
  )
}

// Compact industry selector for mobile
export function CompactIndustrySelector({
  tabs,
  className,
}: Pick<IndustryTabSelectorProps, 'tabs' | 'className'>) {
  return (
    <IndustryTabSelector
      tabs={tabs}
      variant="cards"
      size="sm"
      showDescription={false}
      animated={false}
      className={className}
    />
  )
}
