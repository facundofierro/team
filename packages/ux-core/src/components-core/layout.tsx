'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { Sidebar, SidebarItem, defaultTeamHubItems } from './sidebar'
import { Search, SearchResult } from './search'
import { UserProfile } from './user-profile'
import { Button } from '../components/shadcn/button'
import { Menu, Bell, Settings, HelpCircle, Command, Plus } from 'lucide-react'

export interface LayoutProps {
  className?: string
  children: React.ReactNode
  sidebar?: {
    items?: SidebarItem[]
    activeItem?: string
    collapsed?: boolean
    onToggleCollapse?: () => void
    onNavItemChange?: (item: string) => void
  }
  header?: {
    title?: string
    subtitle?: string
    showSearch?: boolean
    searchProps?: any
    actions?: React.ReactNode
    showUserMenu?: boolean
    user?: any
    userActions?: any
  }
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
    initials?: string
    role?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
  }
  actions?: {
    onRegionClick?: () => void
    onGlobeClick?: () => void
    onLogoutClick?: () => void
    onNotificationsClick?: () => void
    onSettingsClick?: () => void
    onHelpClick?: () => void
    onCreateClick?: () => void
  }
  showMobileMenu?: boolean
  onMobileMenuToggle?: () => void
}

export function Layout({
  className,
  children,
  sidebar = {},
  header = {},
  user,
  actions,
  showMobileMenu = false,
  onMobileMenuToggle,
}: LayoutProps) {
  const {
    items = defaultTeamHubItems,
    activeItem,
    collapsed = false,
    onToggleCollapse,
    onNavItemChange = () => {},
  } = sidebar

  const {
    title,
    subtitle,
    showSearch = true,
    searchProps = {},
    actions: headerActions,
    showUserMenu = true,
    user: headerUser,
    userActions: headerUserActions,
  } = header

  const [searchValue, setSearchValue] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = React.useState(false)

  const handleSearch = async (query: string) => {
    setSearchLoading(true)
    // Simulate search - replace with actual search logic
    setTimeout(() => {
      setSearchResults([
        {
          id: '1',
          title: 'AI Agent Assistant',
          description: 'Intelligent agent for customer support',
          type: 'agent',
          tags: ['AI', 'Support'],
          relevance: 0.95,
        },
        {
          id: '2',
          title: 'Data Processing Workflow',
          description: 'Automated data cleaning and analysis',
          type: 'workflow',
          tags: ['Data', 'Automation'],
          relevance: 0.87,
        },
      ])
      setSearchLoading(false)
    }, 500)
  }

  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      {/* Sidebar */}
      <Sidebar
        items={items}
        activeNavItem={activeItem || ''}
        onNavItemChange={onNavItemChange}
        logo={{
          text: 'TeamHub',
          subtitle: 'AI Agent Platform',
        }}
        user={user || { name: 'User', email: 'user@example.com' }}
        actions={{
          region: 'spb',
          onRegionClick: actions?.onRegionClick,
          onGlobeClick: actions?.onGlobeClick,
          onLogoutClick: actions?.onLogoutClick,
        }}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Title */}
              {title && (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                  )}
                </div>
              )}
            </div>

            {/* Center - Search */}
            {showSearch && (
              <div className="flex-1 max-w-2xl mx-8">
                <Search
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={handleSearch}
                  results={searchResults}
                  loading={searchLoading}
                  variant="minimal"
                  size="md"
                  {...searchProps}
                />
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Header Actions */}
              {headerActions}

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions?.onCreateClick}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions?.onNotificationsClick}
                  className="p-2 relative"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#F45584] rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions?.onSettingsClick}
                  className="p-2"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions?.onHelpClick}
                  className="p-2"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </div>

              {/* User Menu */}
              {showUserMenu && (user || headerUser) && (
                <UserProfile
                  user={user || headerUser}
                  actions={actions || headerUserActions}
                  variant="compact"
                  showActions={false}
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileMenuToggle}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#3B2146] to-[#8A548C] z-50">
            <Sidebar
              items={items}
              activeNavItem={activeItem || ''}
              onNavItemChange={onNavItemChange}
              logo={{
                text: 'TeamHub',
                subtitle: 'AI Agent Platform',
              }}
              user={user || { name: 'User', email: 'user@example.com' }}
              actions={{
                region: 'spb',
                onRegionClick: actions?.onRegionClick,
                onGlobeClick: actions?.onGlobeClick,
                onLogoutClick: actions?.onLogoutClick,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Page header component for individual pages
export interface PageHeaderProps {
  className?: string
  title: string
  subtitle?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
    onClick?: () => void
  }>
  actions?: React.ReactNode
  backButton?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({
  className,
  title,
  subtitle,
  breadcrumbs,
  actions,
  backButton,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <button
                onClick={crumb.onClick}
                className="hover:text-gray-700 transition-colors"
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {backButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={backButton.onClick}
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>{backButton.label}</span>
            </Button>
          )}

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-lg text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-3">{actions}</div>
        )}
      </div>
    </div>
  )
}

// Content container component
export interface ContentContainerProps {
  className?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ContentContainer({
  className,
  children,
  maxWidth = 'full',
  padding = 'md',
}: ContentContainerProps) {
  const getMaxWidth = (width: string) => {
    switch (width) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-xl'
      case '2xl':
        return 'max-w-2xl'
      case 'full':
        return 'max-w-full'
      default:
        return 'max-w-full'
    }
  }

  const getPadding = (pad: string) => {
    switch (pad) {
      case 'none':
        return ''
      case 'sm':
        return 'p-4'
      case 'md':
        return 'p-6'
      case 'lg':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        getMaxWidth(maxWidth),
        getPadding(padding),
        className
      )}
    >
      {children}
    </div>
  )
}
