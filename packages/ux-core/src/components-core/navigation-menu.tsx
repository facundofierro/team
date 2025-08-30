'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { Button } from '../components/shadcn/button'
import { Card } from '../components/shadcn/card'
import { Separator } from '../components/shadcn/separator'
import { ChevronDown, ChevronRight } from 'lucide-react'

export interface NavigationMenuItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string
  disabled?: boolean
  children?: NavigationMenuItem[]
}

export interface NavigationMenuProps {
  className?: string
  items: NavigationMenuItem[]
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'minimal'
  activeItem?: string
  onItemClick?: (item: NavigationMenuItem) => void
}

export function NavigationMenu({
  className,
  items,
  orientation = 'horizontal',
  variant = 'default',
  activeItem,
  onItemClick,
}: NavigationMenuProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId)
    } else {
      newOpenItems.add(itemId)
    }
    setOpenItems(newOpenItems)
  }

  const handleItemClick = (item: NavigationMenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleItem(item.id)
    } else if (item.onClick) {
      item.onClick()
    } else if (onItemClick) {
      onItemClick(item)
    }
  }

  const renderMenuItem = (item: NavigationMenuItem, level: number = 0) => {
    const Icon = item.icon
    const isActive = activeItem === item.id
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openItems.has(item.id)

    return (
      <div key={item.id} className="relative">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start space-x-2 px-3 py-2 h-auto',
            'text-white/80 hover:text-white hover:bg-white/10',
            'transition-colors duration-200',
            isActive && 'bg-white/20 text-white',
            item.disabled && 'opacity-50 cursor-not-allowed',
            level > 0 && 'pl-6',
            variant === 'minimal' && 'px-2'
          )}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-[#F45584] px-2 py-1 text-xs font-medium text-white">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </Button>

        {/* Description tooltip for horizontal orientation */}
        {orientation === 'horizontal' && item.description && (
          <div className="absolute left-full top-0 ml-2 w-64 rounded-lg bg-white/95 p-3 shadow-lg text-gray-900 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
            <p className="text-sm">{item.description}</p>
          </div>
        )}

        {/* Children */}
        {hasChildren && isOpen && (
          <div
            className={cn(
              'mt-1 space-y-1',
              orientation === 'horizontal' &&
                'absolute left-0 top-full mt-1 w-64 z-50'
            )}
          >
            {orientation === 'horizontal' && (
              <Card className="bg-white/95 border-white/20 shadow-lg">
                <div className="p-2 space-y-1">
                  {item.children!.map((child) =>
                    renderMenuItem(child, level + 1)
                  )}
                </div>
              </Card>
            )}
            {orientation === 'vertical' && (
              <div className="ml-4 border-l border-white/20 pl-4">
                {item.children!.map((child) =>
                  renderMenuItem(child, level + 1)
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      className={cn(
        'flex',
        orientation === 'horizontal'
          ? 'flex-row space-x-1'
          : 'flex-col space-y-1',
        className
      )}
    >
      {items.map((item) => renderMenuItem(item))}
    </nav>
  )
}

// Breadcrumb navigation component
export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
}

export interface BreadcrumbsProps {
  className?: string
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
}

export function Breadcrumbs({
  className,
  items,
  separator = <ChevronRight className="h-4 w-4 text-white/50" />,
  maxItems,
}: BreadcrumbsProps) {
  const visibleItems = maxItems ? items.slice(-maxItems) : items
  const hasHiddenItems = maxItems && items.length > maxItems

  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      {hasHiddenItems && (
        <>
          <span className="text-white/50">...</span>
          {separator}
        </>
      )}
      {visibleItems.map((item, index) => {
        const Icon = item.icon
        const isLast = index === visibleItems.length - 1

        return (
          <React.Fragment key={index}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-auto px-2 py-1 text-sm',
                'text-white/70 hover:text-white hover:bg-white/10',
                isLast && 'text-white font-medium'
              )}
              onClick={item.onClick}
              disabled={isLast}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {item.label}
            </Button>
            {!isLast && separator}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Tab navigation component
export interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  disabled?: boolean
  content?: React.ReactNode
}

export interface TabsProps {
  className?: string
  items: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({
  className,
  items,
  activeTab,
  onTabChange,
  variant = 'default',
  orientation = 'horizontal',
}: TabsProps) {
  const [currentTab, setCurrentTab] = React.useState(activeTab || items[0]?.id)

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[#F45584] text-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )
      case 'underline':
        return cn(
          'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'border-[#F45584] text-white'
            : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
        )
      default:
        return cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'text-white border-b-2 border-[#F45584]'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )
    }
  }

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* Tab Headers */}
      <div
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? 'flex-row space-x-1'
            : 'flex-col space-y-1'
        )}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                getTabStyles(isActive),
                'justify-start space-x-2',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              disabled={item.disabled}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-[#F45584] px-2 py-1 text-xs font-medium text-white">
                  {item.badge}
                </span>
              )}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      {items.find((item) => item.id === currentTab)?.content && (
        <div className={cn('mt-4', orientation === 'vertical' && 'ml-4')}>
          {items.find((item) => item.id === currentTab)?.content}
        </div>
      )}
    </div>
  )
}
