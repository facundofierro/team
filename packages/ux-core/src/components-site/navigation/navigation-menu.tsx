import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { siteUtils } from '../colors'

interface NavigationMenuItem {
  label: string
  href?: string
  description?: string
  icon?: React.ReactNode
  external?: boolean
  children?: NavigationMenuItem[]
}

interface NavigationMenuProps {
  items: NavigationMenuItem[]
  className?: string
  variant?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

export function NavigationMenu({
  items,
  className,
  variant = 'horizontal',
  size = 'md',
}: NavigationMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const renderMenuItem = (item: NavigationMenuItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = activeItem === item.label

    if (hasChildren) {
      return (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setActiveItem(item.label)}
          onMouseLeave={() => setActiveItem(null)}
        >
          <button
            className={cn(
              'flex items-center space-x-1 px-3 py-2 rounded-md transition-colors',
              sizeClasses[size],
              'text-gray-700 hover:text-[#F45584] hover:bg-gray-50',
              isActive && 'text-[#F45584] bg-gray-50'
            )}
          >
            <span>{item.label}</span>
            <svg
              className={cn(
                'w-4 h-4 transition-transform',
                isActive && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isActive && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {item.children!.map((child, childIndex) => (
                <a
                  key={childIndex}
                  href={child.href}
                  className={cn(
                    'flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors',
                    child.external && 'group'
                  )}
                  {...(child.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {child.icon && (
                    <div className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-[#F45584] transition-colors">
                      {child.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 font-medium group-hover:text-[#F45584] transition-colors">
                      {child.label}
                      {child.external && (
                        <svg
                          className="inline-block w-4 h-4 ml-1 text-gray-400 group-hover:text-[#F45584] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </p>
                    {child.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {child.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <a
        key={index}
        href={item.href}
        className={cn(
          'px-3 py-2 rounded-md transition-colors',
          sizeClasses[size],
          'text-gray-700 hover:text-[#F45584] hover:bg-gray-50',
          item.external && 'group'
        )}
        {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        <span className="flex items-center space-x-1">
          {item.icon && (
            <span className="w-4 h-4 text-gray-400 group-hover:text-[#F45584] transition-colors">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
          {item.external && (
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-[#F45584] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </span>
      </a>
    )
  }

  return (
    <nav
      className={cn(
        'flex',
        variant === 'horizontal' ? 'flex-row space-x-1' : 'flex-col space-y-1',
        className
      )}
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </nav>
  )
}
