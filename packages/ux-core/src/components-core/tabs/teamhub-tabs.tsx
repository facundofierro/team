'use client'

import * as React from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../components/shadcn'
import { coreColors } from '../light-theme-colors'
import { cn } from '../../utils'

export interface AgelumTabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

export interface AgelumTabsProps {
  items: AgelumTabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

const AgelumTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  AgelumTabsProps
>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      className,
      variant = 'underline',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = React.useState(
      defaultValue || items[0]?.value || ''
    )
    const [indicatorStyle, setIndicatorStyle] = React.useState({
      width: 0,
      left: 0,
    })
    const tabsListRef = React.useRef<HTMLDivElement>(null)

    const currentValue = value !== undefined ? value : activeTab

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setActiveTab(newValue)
      }
      onValueChange?.(newValue)
    }

    // Update indicator position when active tab changes
    React.useEffect(() => {
      if (variant === 'underline' && tabsListRef.current) {
        const activeButton = tabsListRef.current.querySelector(
          `[data-value="${currentValue}"]`
        ) as HTMLElement

        if (activeButton) {
          const listRect = tabsListRef.current.getBoundingClientRect()
          const buttonRect = activeButton.getBoundingClientRect()

          setIndicatorStyle({
            width: buttonRect.width,
            left: buttonRect.left - listRect.left,
          })
        }
      }
    }, [currentValue, variant, items])

    // Size variants
    const sizeClasses = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    }

    // Variant styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'pills':
          return {
            list: 'bg-gray-100 p-1 rounded-lg',
            trigger:
              'rounded-md px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm',
          }
        case 'underline':
          return {
            list: 'bg-transparent border-b border-gray-200 rounded-none p-0 h-auto',
            trigger:
              'relative rounded-none border-b-2 border-transparent px-6 py-4 font-semibold text-sm transition-all hover:text-gray-600',
          }
        default:
          return {
            list: 'bg-gray-50 border border-gray-200 rounded-lg p-1',
            trigger:
              'rounded-md px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm',
          }
      }
    }

    const variantStyles = getVariantStyles()

    return (
      <Tabs
        ref={ref}
        value={currentValue}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        className={cn('w-full', className)}
        {...props}
      >
        <TabsList
          ref={tabsListRef}
          className={cn(
            'inline-flex items-center justify-start w-full relative',
            sizeClasses[size],
            variantStyles.list
          )}
          style={{
            backgroundColor:
              variant === 'underline'
                ? 'transparent'
                : coreColors.background.secondary,
            borderColor:
              variant === 'underline' ? coreColors.border.light : 'transparent',
          }}
        >
          {/* Animated indicator for underline variant */}
          {variant === 'underline' && (
            <div
              className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
                background: `linear-gradient(90deg, ${coreColors.brand.primary} 0%, ${coreColors.brand.accent} 100%)`,
              }}
            />
          )}
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              data-value={item.value}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap font-medium',
                'ring-offset-background transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                variantStyles.trigger
              )}
              style={{
                color:
                  currentValue === item.value
                    ? coreColors.text.primary
                    : coreColors.text.tertiary,
                backgroundColor:
                  variant !== 'underline' && currentValue === item.value
                    ? coreColors.background.primary
                    : 'transparent',
              }}
            >
              {item.icon && (
                <span className="mr-2 flex-shrink-0">{item.icon}</span>
              )}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {items.map((item) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className={cn(
              'mt-4 ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
            )}
            style={{
              color: coreColors.text.primary,
            }}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    )
  }
)

AgelumTabs.displayName = 'AgelumTabs'

export { AgelumTabs }
