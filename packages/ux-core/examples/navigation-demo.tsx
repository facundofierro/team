'use client'

import React from 'react'
import {
  Sidebar,
  defaultTeamHubItems,
  SidebarNavigationMenu,
  Breadcrumbs,
  Tabs,
  UserProfile,
  Search,
  Layout,
  PageHeader,
  ContentContainer,
} from '../src/components-core'
import { Button } from '../src/components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../src/components/shadcn/card'
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Database,
  Wrench,
  CheckSquare,
  Infinity,
} from 'lucide-react'

export default function NavigationDemo() {
  const [activeItem, setActiveItem] = React.useState('agents')
  const [collapsed, setCollapsed] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const [currentTab, setCurrentTab] = React.useState('overview')

  const user = {
    id: '1',
    name: 'Facundo F.',
    email: 'facundofierr...',
    initials: 'F',
    role: 'Admin',
    status: 'online' as const,
  }

  const actions = {
    onRegionClick: () => console.log('Region clicked'),
    onGlobeClick: () => console.log('Globe clicked'),
    onLogoutClick: () => console.log('Logout clicked'),
    onNotificationsClick: () => console.log('Notifications clicked'),
    onSettingsClick: () => console.log('Settings clicked'),
    onHelpClick: () => console.log('Help clicked'),
    onCreateClick: () => console.log('Create clicked'),
  }

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      content: <div className="p-4">Overview content goes here</div>,
    },
    {
      id: 'details',
      label: 'Details',
      icon: FileText,
      content: <div className="p-4">Details content goes here</div>,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <div className="p-4">Settings content goes here</div>,
    },
  ]

  const breadcrumbItems = [
    { label: 'Dashboard', onClick: () => console.log('Dashboard') },
    { label: 'Agents', onClick: () => console.log('Agents') },
    { label: 'AI Assistant' },
  ]

  return (
    <Layout
      sidebar={{
        items: defaultTeamHubItems,
        activeItem,
        collapsed,
        onToggleCollapse: () => setCollapsed(!collapsed),
      }}
      user={user}
      actions={actions}
      header={{
        title: 'Navigation Components Demo',
        subtitle: 'Showcasing all TeamHub navigation components',
      }}
    >
      <ContentContainer>
        <PageHeader
          title="Navigation Components"
          subtitle="Complete set of navigation components for TeamHub"
          breadcrumbs={breadcrumbItems}
          actions={
            <Button onClick={() => setCollapsed(!collapsed)}>
              Toggle Sidebar
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sidebar Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 border rounded-lg overflow-hidden">
                <Sidebar
                  items={defaultTeamHubItems}
                  activeItem={activeItem}
                  collapsed={false}
                  user={user}
                  actions={{
                    region: 'spb',
                    onRegionClick: actions.onRegionClick,
                    onGlobeClick: actions.onGlobeClick,
                    onLogoutClick: actions.onLogoutClick,
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Features: Collapsible, user profile, action buttons, active
                  states
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveItem('dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveItem('agents')}
                  >
                    Agents
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveItem('settings')}
                  >
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Search Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Search
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search agents, workflows..."
                  variant="default"
                  size="md"
                />
                <Search
                  placeholder="Minimal search..."
                  variant="minimal"
                  size="sm"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Features: Auto-complete, search suggestions, quick actions,
                  keyboard shortcuts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Demo */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-b from-[#3B2146] to-[#8A548C] p-4 rounded-lg">
                  <UserProfile
                    user={user}
                    actions={actions}
                    variant="default"
                  />
                </div>
                <div className="bg-gradient-to-b from-[#3B2146] to-[#8A548C] p-4 rounded-lg">
                  <UserProfile
                    user={user}
                    variant="compact"
                    showActions={false}
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Features: Multiple variants, status indicators, action buttons
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Tabs Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-[#3B2146] to-[#8A548C] p-4 rounded-lg">
                <Tabs
                  items={navigationItems}
                  activeTab={currentTab}
                  onTabChange={setCurrentTab}
                  variant="default"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Features: Multiple variants (default, pills, underline),
                  content switching
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Breadcrumbs Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumbs Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-[#3B2146] to-[#8A548C] p-4 rounded-lg">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Features: Clickable navigation, customizable separators, max
                  items limit
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Menu Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-[#3B2146] to-[#8A548C] p-4 rounded-lg">
                <SidebarNavigationMenu
                  items={[
                    {
                      id: 'agents',
                      label: 'Agents',
                      icon: Users,
                      children: [
                        { id: 'all-agents', label: 'All Agents' },
                        { id: 'active-agents', label: 'Active Agents' },
                        { id: 'inactive-agents', label: 'Inactive Agents' },
                      ],
                    },
                    {
                      id: 'workflows',
                      label: 'Workflows',
                      icon: Infinity,
                      children: [
                        { id: 'all-workflows', label: 'All Workflows' },
                        { id: 'running-workflows', label: 'Running' },
                        { id: 'completed-workflows', label: 'Completed' },
                      ],
                    },
                  ]}
                  orientation="vertical"
                  activeItem="agents"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Features: Dropdown menus, nested navigation,
                  horizontal/vertical orientation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Sidebar Usage</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { Sidebar, defaultTeamHubItems } from '@teamhub/ux-core'

<Sidebar
  items={defaultTeamHubItems}
  activeItem="agents"
  user={user}
  actions={actions}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Search with Results</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { Search } from '@teamhub/ux-core'

<Search
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  results={searchResults}
  loading={isLoading}
/>`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Complete Layout</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {`import { Layout } from '@teamhub/ux-core'

<Layout
  sidebar={{ items: defaultTeamHubItems, activeItem: 'agents' }}
  user={user}
  actions={actions}
  header={{ title: 'My Page', showSearch: true }}
>
  <PageHeader title="Page Title" />
  <ContentContainer>
    {/* Your page content */}
  </ContentContainer>
</Layout>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentContainer>
    </Layout>
  )
}
