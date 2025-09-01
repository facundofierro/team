'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Workflow,
  Database,
  FileText,
  Wrench,
  Settings,
} from '@teamhub/ux-core/node_modules/lucide-react'
import {
  Sidebar,
  type SidebarItem,
} from '@teamhub/ux-core/src/components-core/sidebar'

const customItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    active: false,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: CheckSquare,
    active: false,
  },
  {
    id: 'agents',
    name: 'Agents',
    icon: Users,
    active: true,
  },
  {
    id: 'workflows',
    name: 'Workflows',
    icon: Workflow,
    active: false,
  },
  {
    id: 'data-hub',
    name: 'Data Hub',
    icon: Database,
    active: false,
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    active: false,
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Wrench,
    active: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    active: false,
  },
]

export default function SidebarTestPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [selectedOrg, setSelectedOrg] = useState('org-1')

  const handleNavItemChange = (itemId: string) => {
    setActiveItem(itemId)
    console.log('Item clicked:', itemId)
  }

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrg(organizationId)
    console.log('Organization changed to:', organizationId)
  }

  const organizations = [
    { id: 'org-1', name: 'Saint Petersburg Hub', region: 'Saint Petersburg' },
    { id: 'org-2', name: 'Moscow Central', region: 'Moscow' },
    { id: 'org-3', name: 'New York Office', region: 'New York' },
  ]

  const selectedOrganization = organizations.find(
    (org) => org.id === selectedOrg
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <Sidebar
          items={customItems}
          activeNavItem={activeItem}
          onNavItemChange={handleNavItemChange}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          logo={{
            text: 'AgentHub',
            subtitle: 'AI Agent Network',
          }}
          user={{
            name: 'Facundo F.',
            email: 'facundofierro@yandex.com',
            initials: 'FF',
          }}
          actions={{
            region: selectedOrganization?.name,
            organizations: organizations,
            onOrganizationChange: handleOrganizationChange,
            onRegionClick: () => console.log('Region clicked'),
            onGlobeClick: () => console.log('Globe clicked'),
            onLogoutClick: () => console.log('Logout clicked'),
          }}
        />

        {/* Main content area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              Main Application Content
            </h1>
            <p className="mb-4 text-gray-600">
              This is how the sidebar would look in a real application. The
              sidebar is on the left, and your main content area is on the
              right.
            </p>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Current Active Section: {activeItem}
              </h2>
              <p className="mb-4 text-gray-600">
                The sidebar navigation is working! Click on different items to
                see the active state change.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Current Organization: {selectedOrganization?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Display Initials:{' '}
                  {selectedOrganization?.name
                    ?.split(' ')
                    .map((word) => word.charAt(0).toUpperCase())
                    .join('')
                    .slice(0, 3)}
                </p>
                <p className="text-sm text-gray-600">
                  Region: {selectedOrganization?.region}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {selectedOrganization?.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
