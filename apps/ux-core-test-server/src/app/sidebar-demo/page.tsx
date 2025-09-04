'use client'

import { useState } from 'react'
import { Sidebar, defaultAgelumItems } from '@agelum/ux-core'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Workflow,
  Database,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  Search,
} from 'lucide-react'

export default function SidebarDemoPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedItem, setSelectedItem] = useState('dashboard')

  // Custom sidebar items for demo
  const demoItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'agents',
      name: 'AI Agents',
      icon: Users,
    },
    {
      id: 'workflows',
      name: 'Workflows',
      icon: Workflow,
      submenu: [
        {
          id: 'active-workflows',
          name: 'Active Workflows',
        },
        {
          id: 'workflow-templates',
          name: 'Templates',
        },
        {
          id: 'workflow-history',
          name: 'History',
        },
      ],
    },
    {
      id: 'tasks',
      name: 'Tasks',
      icon: CheckSquare,
    },
    {
      id: 'data',
      name: 'Data Sources',
      icon: Database,
      submenu: [
        {
          id: 'databases',
          name: 'Databases',
        },
        {
          id: 'apis',
          name: 'APIs',
        },
        {
          id: 'files',
          name: 'Files',
        },
      ],
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
    },
  ]

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId)
    console.log('Selected item:', itemId)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          items={defaultAgelumItems}
          activeNavItem={selectedItem}
          onNavItemChange={handleItemClick}
          logo={{
            text: 'Agelum',
            subtitle: 'AI Platform',
          }}
          user={{
            name: 'John Doe',
            email: 'john@agelum.com',
            initials: 'JD',
          }}
          actions={{
            region: 'US East',
            organizations: [
              { id: '1', name: 'Acme Corp' },
              { id: '2', name: 'Tech Solutions' },
            ],
          }}
          className="h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sidebar Demo</h1>
              <p className="text-gray-600">
                Interactive sidebar with navigation and collapsible sections
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isCollapsed ? (
                  <LayoutDashboard className="w-5 h-5" />
                ) : (
                  <LayoutDashboard className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Demo Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sidebar Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Current State
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Collapsed: {isCollapsed ? 'Yes' : 'No'}</li>
                    <li>• Selected Item: {selectedItem}</li>
                    <li>• Total Items: {demoItems.length}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Interactive Features
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click items to select them</li>
                    <li>• Expand/collapse sections</li>
                    <li>• Toggle sidebar width</li>
                    <li>• Badge indicators</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar Variants */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Default Agelum Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Default Agelum Items
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  The sidebar can use predefined Agelum navigation items
                </p>
                <div className="text-xs text-gray-500">
                  <pre className="bg-gray-50 p-3 rounded">
                    {`defaultAgelumItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agents', label: 'AI Agents', icon: Users },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'data', label: 'Data Sources', icon: Database },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings }
]`}
                  </pre>
                </div>
              </div>

              {/* Custom Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Custom Items
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can define custom navigation items with:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom icons and labels</li>
                  <li>• Nested children items</li>
                  <li>• Badge indicators</li>
                  <li>• Custom href links</li>
                  <li>• Click handlers</li>
                </ul>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Usage Examples
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Basic Usage
                  </h4>
                  <div className="text-xs text-gray-500">
                    <pre className="bg-gray-50 p-3 rounded">
                      {`<Sidebar
  items={demoItems}
  isCollapsed={isCollapsed}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
  onItemClick={handleItemClick}
  selectedItemId={selectedItem}
/>`}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    With Default Items
                  </h4>
                  <div className="text-xs text-gray-500">
                    <pre className="bg-gray-50 p-3 rounded">
                      {`<Sidebar
  items={defaultAgelumItems}
  isCollapsed={false}
  onToggleCollapse={handleToggle}
  onItemClick={handleClick}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
