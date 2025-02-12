'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  LineChart,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrganizationSwitcher } from './OrganizationSwitcher'
import { Organization } from '@teamhub/db'
import { useOrganizationStore } from '@/stores/organizationStore'
import { useNavigationStore } from '@/stores/navigationStore'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Users },
  { name: 'Insights', href: '/insights', icon: LineChart },
  { name: 'Settings', href: '/settings', icon: Settings },
]

type SidebarProps = {
  organizations: Organization[]
  session: Session | null
}

export function Sidebar({ organizations, session }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentOrganization } = useOrganizationStore()
  const { currentPath, setCurrentPath, setIsLoading, isLoading } =
    useNavigationStore()

  useEffect(() => {
    console.log('debug isLoading', isLoading)
  }, [isLoading])

  const handleNavigation = (href: string) => {
    setCurrentPath(null)
    setTimeout(() => {
      setCurrentPath(href)
      setIsLoading(true)
      const url = new URL(window.location.href)
      url.pathname = href
      if (currentOrganization?.id) {
        url.searchParams.set('organizationId', currentOrganization.id)
      }
      router.push(url.toString())
    }, 0)
  }

  const handleSignOut = () => {
    const baseUrl = window.location.origin
    signOut({ callbackUrl: `${baseUrl}/api/auth/signin` })
  }

  return (
    <div className="flex flex-col w-48 h-screen text-gray-200 border-r bg-menu">
      <div className="p-4 border-b">
        <h1 className="ml-4 text-xl font-bold text-gray-200">TeamHub</h1>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isSelected = currentPath === item.href
              return (
                <li key={item.href}>
                  <Button
                    variant={isSelected ? 'secondary' : 'ghost'}
                    className="relative justify-start w-full"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                    {isSelected && isLoading && (
                      <div className="absolute w-4 h-4 border-t-2 border-b-2 border-current rounded-full right-2 animate-spin" />
                    )}
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>
      </ScrollArea>

      <div className="mt-auto">
        <Separator />
        <OrganizationSwitcher organizations={organizations} />
        <Separator />
        <div className="flex flex-col items-center p-4 space-y-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-medium">
              {session?.user?.name || 'User'}
            </span>
            <span className="text-xs text-gray-400 break-all">
              {session?.user?.email || ''}
            </span>
          </div>
          <div className="flex items-center gap-2 ">
            <Select defaultValue="en">
              <SelectTrigger className="w-10 h-10 p-0 border-0 hover:bg-accent hover:text-accent-foreground">
                <SelectValue>
                  <Globe className="w-4 h-4" />
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md">
                <SelectItem value="en">
                  <span className="flex items-center gap-2">🇺🇸 English</span>
                </SelectItem>
                <SelectItem value="es">
                  <span className="flex items-center gap-2">🇪🇸 Español</span>
                </SelectItem>
                <SelectItem value="ru">
                  <span className="flex items-center gap-2">🇷🇺 Русский</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
