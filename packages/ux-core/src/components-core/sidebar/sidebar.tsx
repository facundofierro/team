'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Workflow,
  Database,
  FileText,
  Settings,
  Globe,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { componentColors, componentUtils } from '../dark-theme-colors'
import { defaultTeamHubItems } from './navigation-items'

export interface SidebarItem {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
  submenu?: {
    id: string
    name: string
    active?: boolean
  }[]
}

export interface SidebarProps {
  className?: string
  items: SidebarItem[]
  activeNavItem: string
  onNavItemChange: (item: string) => void
  logo: {
    text: string
    subtitle?: string
  }
  user: {
    name: string
    email: string
    initials?: string
  }
  actions: {
    region?: string
    organizations?: Array<{
      id: string
      name: string
      region?: string
    }>
    onOrganizationChange?: (organizationId: string) => void
    onRegionClick?: () => void
    onGlobeClick?: () => void
    onLogoutClick?: () => void
  }
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const defaultItems: SidebarItem[] = defaultTeamHubItems

export const Sidebar = ({
  className,
  items,
  activeNavItem,
  onNavItemChange,
  logo,
  user,
  actions,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState('chat')

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        !target.closest('[data-dropdown="org"]') &&
        !target.closest('[data-dropdown="lang"]')
      ) {
        setShowOrgDropdown(false)
        setShowLangDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavItemChange = (itemId: string) => {
    onNavItemChange(itemId)
  }

  // Utility function to get initials from organization name
  const getOrganizationInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3) // Limit to 3 characters max
  }

  return (
    <aside
      data-testid="sidebar"
      className={`${collapsed ? 'w-16' : 'w-56'} flex flex-col border-r ${
        className || ''
      }`}
      style={{
        backgroundColor: componentColors.background.main,
        borderColor: componentColors.border.main,
      }}
    >
      {/* Brand Header */}
      <div
        className="px-6 py-6 border-b"
        style={{
          backgroundColor: componentColors.background.header,
          borderColor: componentColors.border.header,
          backdropFilter: componentColors.effects.backdropFilter,
        }}
      >
        <div className="flex items-center space-x-4">
          <div
            className="flex justify-center items-center w-12 h-12 rounded-xl"
            style={{
              background: componentColors.brand.iconBackground,
              ...componentUtils.getComponentShadow('md'),
            }}
          >
            <Sparkles
              className="w-6 h-6"
              style={{
                color: componentColors.brand.iconColor,
              }}
            />
          </div>
          {!collapsed && (
            <div>
              <h1
                className="text-xl font-bold"
                style={{
                  color: '#FFFFFF',
                }}
              >
                <span>{logo.text}</span>
              </h1>
              <p
                className="text-sm"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <span>{logo.subtitle}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeNavItem === item.id
          return (
            <div key={item.id}>
              <button
                onClick={() => handleNavItemChange(item.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  borderColor: 'transparent',
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                    e.currentTarget.style.transform = 'translateX(0px)'
                  }
                }}
                data-testid={`sidebar-item-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className="w-5 h-5" />}
                  {!collapsed && <span>{item.name}</span>}
                </div>
                {item.submenu && !collapsed && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`}
                  />
                )}
              </button>

              {/* Submenu for Agents */}
              {item.id === 'agents' &&
                isActive &&
                item.submenu &&
                !collapsed && (
                  <div
                    className="pl-4 mt-3 ml-6 space-y-1 border-l"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveSubmenu(subItem.id)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border"
                        style={{
                          backgroundColor:
                            activeSubmenu === subItem.id
                              ? componentColors.interactive.submenuActive
                              : 'transparent',
                          borderColor:
                            activeSubmenu === subItem.id
                              ? componentColors.interactive.submenuActive
                              : 'transparent',
                          color:
                            activeSubmenu === subItem.id
                              ? '#FFFFFF'
                              : 'rgba(255, 255, 255, 0.6)',
                        }}
                        onMouseEnter={(e) => {
                          if (activeSubmenu !== subItem.id) {
                            e.currentTarget.style.backgroundColor =
                              'rgba(255, 255, 255,maye  0.05)'
                            e.currentTarget.style.color =
                              'rgba(255, 255, 255, 0.8)'
                            e.currentTarget.style.transform = 'translateX(4px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeSubmenu !== subItem.id) {
                            e.currentTarget.style.backgroundColor =
                              'transparent'
                            e.currentTarget.style.color =
                              'rgba(255, 255, 255, 0.6)'
                            e.currentTarget.style.transform = 'translateX(0px)'
                          }
                        }}
                      >
                        <span>{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div
        className="p-6 space-y-4 border-t"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* User Profile */}
        {user && (
          <div
            className="flex items-center p-4 space-x-3 rounded-xl border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              ...componentUtils.getComponentShadow('sm'),
            }}
          >
            <div
              className="flex justify-center items-center w-11 h-11 rounded-xl"
              style={{
                background: componentColors.brand.iconBackground,
                ...componentUtils.getComponentShadow('sm'),
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{
                  color: '#FFFFFF',
                }}
              >
                {user.initials ||
                  user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{
                    color: '#FFFFFF',
                  }}
                >
                  <span>{user.name}</span>
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <span>{user.email}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        {actions && (
          <div className="flex items-center space-x-3">
            {/* Organization Selector */}
            {actions.organizations &&
              actions.organizations.length > 0 &&
              !collapsed && (
                <div className="relative flex-1" data-dropdown="org">
                  <button
                    onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                    className="px-4 py-3 w-full text-sm font-medium rounded-xl border transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      ...componentUtils.getComponentShadow('sm'),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow =
                        componentUtils.getComponentShadow('md').boxShadow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0px)'
                      e.currentTarget.style.boxShadow =
                        componentUtils.getComponentShadow('sm').boxShadow
                    }}
                  >
                    <span>
                      {getOrganizationInitials(
                        actions.region || actions.organizations[0]?.name || ''
                      )}
                    </span>
                  </button>

                  {showOrgDropdown && (
                    <div
                      className="overflow-hidden absolute right-0 left-0 bottom-full mb-2 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(68, 51, 122, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(16px)',
                        ...componentUtils.getComponentShadow('xl'),
                        minWidth: '200px',
                        zIndex: 1000,
                      }}
                    >
                      {actions.organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            actions.onOrganizationChange?.(org.id)
                            setShowOrgDropdown(false)
                          }}
                          className="px-4 py-3 w-full text-sm text-left transition-colors duration-200 hover:bg-white/10"
                          style={{
                            color:
                              actions.region === org.name
                                ? '#FFFFFF'
                                : 'rgba(255, 255, 255, 0.7)',
                            backgroundColor:
                              actions.region === org.name
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'transparent',
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{org.name}</span>
                            {org.region && (
                              <span className="text-xs opacity-60">
                                {org.region}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Language Selector */}
            <div className="relative" data-dropdown="lang">
              <button
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown)
                  actions.onGlobeClick?.()
                }}
                className="flex justify-center items-center w-11 h-11 rounded-xl border transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  ...componentUtils.getComponentShadow('sm'),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow =
                    componentUtils.getComponentShadow('md').boxShadow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.boxShadow =
                    componentUtils.getComponentShadow('sm').boxShadow
                }}
              >
                <Globe className="w-4 h-4" />
              </button>

              {showLangDropdown && (
                <div
                  className="absolute bottom-full mb-2 left-0 border rounded-xl min-w-[140px] overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(68, 51, 122, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(16px)',
                    ...componentUtils.getComponentShadow('xl'),
                  }}
                >
                  <button
                    className="px-4 py-3 w-full text-sm text-left transition-colors duration-200"
                    style={{
                      color: '#FFFFFF',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span>English</span>
                  </button>
                  <button
                    className="px-4 py-3 w-full text-sm text-left transition-colors duration-200"
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span>Español</span>
                  </button>
                  <button
                    className="px-4 py-3 w-full text-sm text-left transition-colors duration-200"
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span>Русский</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              className="flex justify-center items-center w-11 h-11 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)',
                ...componentUtils.getComponentShadow('sm'),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow =
                  componentUtils.getComponentShadow('md').boxShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow =
                  componentUtils.getComponentShadow('sm').boxShadow
              }}
              onClick={actions.onLogoutClick}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export { defaultItems as defaultTeamHubItems }
