'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { Button } from '../components/shadcn/button'
import { Card } from '../components/shadcn/card'
import { Badge } from '../components/shadcn/badge'
import { Separator } from '../components/shadcn/separator'
import {
  User,
  Mail,
  Settings,
  LogOut,
  Globe,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react'

export interface UserProfileProps {
  className?: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    initials?: string
    role?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
    lastSeen?: string
  }
  actions?: {
    onProfileClick?: () => void
    onSettingsClick?: () => void
    onLogoutClick?: () => void
    onGlobeClick?: () => void
    onNotificationsClick?: () => void
    onHelpClick?: () => void
  }
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  showStatus?: boolean
}

export function UserProfile({
  className,
  user,
  actions,
  variant = 'default',
  showActions = true,
  showStatus = true,
}: UserProfileProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'away':
        return 'Away'
      case 'busy':
        return 'Busy'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F45584] to-[#A091DA] text-white font-semibold">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              user.initials || user.name.charAt(0).toUpperCase()
            )}
          </div>
          {showStatus && user.status && (
            <div
              className={cn(
                'absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white',
                getStatusColor(user.status)
              )}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          {user.role && (
            <p className="text-xs text-white/70 truncate">{user.role}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('bg-white/10 border-white/20 text-white', className)}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#F45584] to-[#A091DA] text-white font-semibold text-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  user.initials || user.name.charAt(0).toUpperCase()
                )}
              </div>
              {showStatus && user.status && (
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white',
                    getStatusColor(user.status)
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {user.name}
              </h3>
              <p className="text-sm text-white/70 truncate">{user.email}</p>
              {user.role && (
                <Badge
                  variant="secondary"
                  className="mt-1 bg-white/20 text-white border-white/30"
                >
                  {user.role}
                </Badge>
              )}
            </div>
          </div>

          {/* Status */}
          {showStatus && user.status && (
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  getStatusColor(user.status)
                )}
              />
              <span className="text-sm text-white/80">
                {getStatusText(user.status)}
              </span>
              {user.lastSeen && (
                <span className="text-xs text-white/60">
                  • Last seen {user.lastSeen}
                </span>
              )}
            </div>
          )}

          <Separator className="bg-white/20" />

          {/* Actions */}
          {showActions && actions && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onProfileClick}
                className="border-white/20 text-white/80 hover:text-white hover:border-white/40"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onSettingsClick}
                className="border-white/20 text-white/80 hover:text-white hover:border-white/40"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onNotificationsClick}
                className="border-white/20 text-white/80 hover:text-white hover:border-white/40"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onHelpClick}
                className="border-white/20 text-white/80 hover:text-white hover:border-white/40"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={actions?.onGlobeClick}
              className="flex-1 border-white/20 text-white/80 hover:text-white hover:border-white/40"
            >
              <Globe className="h-4 w-4 mr-2" />
              Region
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={actions?.onLogoutClick}
              className="flex-1 border-white/20 text-white/80 hover:text-white hover:border-white/40"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn('bg-white/10 border-white/20 text-white', className)}>
      <div className="p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F45584] to-[#A091DA] text-white font-semibold">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                user.initials || user.name.charAt(0).toUpperCase()
              )}
            </div>
            {showStatus && user.status && (
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white',
                  getStatusColor(user.status)
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-white/70 truncate">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && actions && (
          <div className="mt-3 flex space-x-2">
            {actions.region && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onGlobeClick}
                className="flex-1 h-8 text-xs border-white/20 text-white/80 hover:text-white hover:border-white/40"
              >
                <Globe className="h-3 w-3 mr-1" />
                Region
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={actions.onLogoutClick}
              className="h-8 w-8 p-0 border-white/20 text-white/80 hover:text-white hover:border-white/40"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

// User menu dropdown component
export interface UserMenuProps {
  className?: string
  user: UserProfileProps['user']
  actions?: UserProfileProps['actions']
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserMenu({
  className,
  user,
  actions,
  trigger,
  open,
  onOpenChange,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div className={cn('relative', className)}>
      {trigger || (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenChange(!isOpen)}
          className="h-auto p-2 text-white/80 hover:text-white hover:bg-white/10"
        >
          <UserProfile user={user} variant="compact" showActions={false} />
        </Button>
      )}

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <UserProfile
            user={user}
            actions={actions}
            variant="detailed"
            className="shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
