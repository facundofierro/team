'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { Button } from '../components/shadcn/button'
import { Card } from '../components/shadcn/card'
import { Separator } from '../components/shadcn/separator'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Infinity,
  Database,
  FileText,
  Wrench,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  badge?: string
  disabled?: boolean
}

export interface SidebarProps {
  className?: string
  items: SidebarItem[]
  activeItem?: string
  logo?: {
    src?: string
    alt?: string
    text: string
    subtitle?: string
  }
  user?: {
    name: string
    email: string
    avatar?: string
    initials?: string
  }
  actions?: {
    region?: string
    onRegionClick?: () => void
    onGlobeClick?: () => void
    onLogoutClick?: () => void
  }
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  className,
  items,
  activeItem,
  logo = { text: 'TeamHub', subtitle: 'AI Agent Network' },
  user,
  actions,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <div
      data-testid="sidebar"
      className={cn(
        'flex h-full flex-col bg-gradient-to-b from-[#3B2146] to-[#8A548C] text-white',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F45584] to-[#A091DA]">
            <div className="w-6 h-6 text-white">
              {/* Logo icon - you can replace this with your actual logo */}
              <div className="w-full h-full bg-white rounded-sm opacity-90" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white">{logo.text}</h1>
              <p className="text-xs text-white/70">{logo.subtitle}</p>
            </div>
          )}
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-0 w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        )}
      </div>

      <Separator className="bg-white/20" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <Button
              key={item.id}
              data-testid={`sidebar-item-${item.id}`}
              variant="ghost"
              className={cn(
                'w-full justify-start space-x-3 px-3 py-2 h-auto',
                'text-white/80 hover:text-white hover:bg-white/10',
                'transition-colors duration-200',
                isActive && 'bg-white/20 text-white',
                item.disabled && 'opacity-50 cursor-not-allowed',
                collapsed && 'justify-center px-2'
              )}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive && 'text-[#F45584]'
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-[#F45584] px-2 py-1 text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* User Profile & Actions */}
      {user && (
        <>
          <Separator className="bg-white/20" />
          <div className="p-4 space-y-3">
            {/* User Profile Card */}
            <Card className="text-white bg-white/10 border-white/20">
              <div className="flex items-center p-3 space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F45584] to-[#A091DA] text-white font-semibold">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    user.initials || user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs truncate text-white/70">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            {!collapsed && actions && (
              <div className="flex space-x-2">
                {actions.region && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.onRegionClick}
                    className="flex-1 h-8 text-xs border-white/20 text-white/80 hover:text-white hover:border-white/40"
                  >
                    {actions.region}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.onGlobeClick}
                  className="p-0 w-8 h-8 border-white/20 text-white/80 hover:text-white hover:border-white/40"
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.onLogoutClick}
                  className="p-0 w-8 h-8 border-white/20 text-white/80 hover:text-white hover:border-white/40"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Default navigation items for TeamHub
export const defaultTeamHubItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: Users,
    href: '/agents',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: Infinity,
    href: '/workflows',
  },
  {
    id: 'data-hub',
    label: 'Data Hub',
    icon: Database,
    href: '/data-hub',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    href: '/documents',
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Wrench,
    href: '/tools',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]
