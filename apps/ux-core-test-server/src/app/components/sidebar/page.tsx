'use client'

import { useState } from 'react'
import {
  Sidebar,
  defaultTeamHubItems,
  type SidebarItem,
} from '@teamhub/ux-core/src/components-core/sidebar'
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
} from 'lucide-react'

const customItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: Infinity,
    href: '/agents',
    badge: '12',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
    badge: '3',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/users',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    href: '/database',
  },
  {
    id: 'docs',
    label: 'Documentation',
    icon: FileText,
    href: '/docs',
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

export default function SidebarTestPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <div className="min-h-screen bg-bg-background">
      <div className="flex h-screen">
        <Sidebar
          items={customItems}
          activeItem={activeItem}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          logo={{
            text: 'TeamHub',
            subtitle: 'AI Agent Network',
          }}
          user={{
            name: 'John Doe',
            email: 'john@teamhub.com',
            initials: 'JD',
          }}
          actions={{
            region: 'US East',
            onRegionClick: () => console.log('Region clicked'),
            onGlobeClick: () => console.log('Globe clicked'),
            onLogoutClick: () => console.log('Logout clicked'),
          }}
        />

        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-bg-foreground mb-6">
              Sidebar Component Test
            </h1>

            <div className="space-y-8">
              <div className="bg-bg-card border border-bg-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-bg-foreground mb-4">
                  Interactive Controls
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-bg-foreground mb-2">
                      Active Item
                    </label>
                    <select
                      value={activeItem}
                      onChange={(e) => setActiveItem(e.target.value)}
                      className="w-full p-2 border border-bg-border rounded-md bg-bg-input text-bg-foreground"
                    >
                      {customItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      className="px-4 py-2 bg-bg-primary text-bg-primary-foreground rounded-md hover:bg-bg-primary/90"
                    >
                      {collapsed ? 'Expand' : 'Collapse'} Sidebar
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border border-bg-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-bg-foreground mb-4">
                  Component Features
                </h2>
                <ul className="space-y-2 text-bg-muted-foreground">
                  <li>
                    • Responsive design with collapse/expand functionality
                  </li>
                  <li>• Active item highlighting</li>
                  <li>• Badge support for notifications</li>
                  <li>• User profile section with avatar</li>
                  <li>• Region selector and logout actions</li>
                  <li>• Custom logo and branding</li>
                  <li>• Gradient background with TeamHub styling</li>
                </ul>
              </div>

              <div className="bg-bg-card border border-bg-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-bg-foreground mb-4">
                  Test Scenarios
                </h2>
                <div className="space-y-2 text-sm text-bg-muted-foreground">
                  <div>• Click on different navigation items</div>
                  <div>• Toggle sidebar collapse state</div>
                  <div>• Test responsive behavior on mobile</div>
                  <div>• Verify badge display and positioning</div>
                  <div>• Check user profile interactions</div>
                  <div>• Test action button functionality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
