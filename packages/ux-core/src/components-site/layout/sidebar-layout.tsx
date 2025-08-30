import React, { useState } from 'react'
import { cn } from '@/utils'

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl'
  sidebarPosition?: 'left' | 'right'
  sidebarClassName?: string
  mainClassName?: string
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
  showMobileToggle?: boolean
  defaultMobileOpen?: boolean
  onSidebarToggle?: (isOpen: boolean) => void
}

const sidebarWidths = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[28rem]',
}

const mobileBreakpoints = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
}

export function SidebarLayout({
  sidebar,
  children,
  className,
  sidebarWidth = 'md',
  sidebarPosition = 'left',
  sidebarClassName,
  mainClassName,
  mobileBreakpoint = 'lg',
  showMobileToggle = true,
  defaultMobileOpen = false,
  onSidebarToggle,
}: SidebarLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(defaultMobileOpen)

  const handleMobileToggle = () => {
    const newState = !isMobileOpen
    setIsMobileOpen(newState)
    onSidebarToggle?.(newState)
  }

  const sidebarClasses = cn(
    'fixed top-0 h-full bg-white border-r border-teamhub-border/20 shadow-lg transition-transform duration-300 ease-in-out z-40',
    sidebarWidths[sidebarWidth],
    sidebarPosition === 'left' ? 'left-0' : 'right-0',
    sidebarPosition === 'left' ? 'translate-x-0' : 'translate-x-0',
    mobileBreakpoints[mobileBreakpoint],
    isMobileOpen
      ? 'translate-x-0'
      : sidebarPosition === 'left'
      ? '-translate-x-full'
      : 'translate-x-full',
    sidebarClassName
  )

  const mainClasses = cn(
    'transition-all duration-300 ease-in-out min-h-screen',
    sidebarPosition === 'left' ? 'pl-0' : 'pr-0',
    mobileBreakpoints[mobileBreakpoint],
    sidebarPosition === 'left'
      ? `lg:pl-${sidebarWidths[sidebarWidth].replace('w-', '')}`
      : `lg:pr-${sidebarWidths[sidebarWidth].replace('w-', '')}`,
    mainClassName
  )

  return (
    <div className={cn('relative', className)}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={handleMobileToggle}
        />
      )}

      {/* Mobile Toggle Button */}
      {showMobileToggle && (
        <button
          onClick={handleMobileToggle}
          className={cn(
            'fixed top-4 z-50 p-2 bg-white border border-teamhub-border/20 rounded-lg shadow-lg lg:hidden',
            sidebarPosition === 'left' ? 'left-4' : 'right-4'
          )}
        >
          <svg
            className="w-5 h-5 text-teamhub-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="h-full overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Main Content */}
      <main className={mainClasses}>{children}</main>
    </div>
  )
}

// Specialized sidebar layout for AI chat
interface AIChatSidebarLayoutProps {
  chatPanel: React.ReactNode
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function AIChatSidebarLayout({
  chatPanel,
  children,
  className,
  isOpen = true,
  onToggle,
}: AIChatSidebarLayoutProps) {
  return (
    <SidebarLayout
      sidebar={chatPanel}
      sidebarWidth="md"
      sidebarPosition="right"
      defaultMobileOpen={isOpen}
      onSidebarToggle={onToggle}
      className={className}
      sidebarClassName="bg-gradient-to-b from-teamhub-background to-white border-l border-teamhub-highlight/20"
    >
      {children}
    </SidebarLayout>
  )
}

// Left sidebar layout for navigation
interface NavigationSidebarLayoutProps {
  navigation: React.ReactNode
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function NavigationSidebarLayout({
  navigation,
  children,
  className,
  isOpen = true,
  onToggle,
}: NavigationSidebarLayoutProps) {
  return (
    <SidebarLayout
      sidebar={navigation}
      sidebarWidth="lg"
      sidebarPosition="left"
      defaultMobileOpen={isOpen}
      onSidebarToggle={onToggle}
      className={className}
      sidebarClassName="bg-gradient-to-b from-teamhub-secondary to-teamhub-primary border-r border-teamhub-accent/20"
    >
      {children}
    </SidebarLayout>
  )
}

// Responsive container that works with sidebar layouts
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-6',
    md: 'px-6 py-8',
    lg: 'px-8 py-12',
    xl: 'px-12 py-16',
  }

  return (
    <div
      className={cn(
        'mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
