'use client'

import { TeamHubTabs, type TeamHubTabItem } from '@teamhub/ux-core'

const tabItems: TeamHubTabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Overview Content</h3>
        <p className="text-gray-600">
          This is the overview tab content. Here you can display general information, 
          statistics, or a dashboard-like view.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">Metric 1</h4>
            <p className="text-2xl font-bold text-purple-600">42</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">Metric 2</h4>
            <p className="text-2xl font-bold text-purple-600">127</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">Metric 3</h4>
            <p className="text-2xl font-bold text-purple-600">89%</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'agents',
    label: 'Agents',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Agents Management</h3>
        <p className="text-gray-600">
          Manage your AI agents, view their performance, and configure their settings.
        </p>
        <div className="space-y-3">
          {['Agent Alpha', 'Agent Beta', 'Agent Gamma'].map((agent, index) => (
            <div key={agent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{agent}</div>
                <div className="text-sm text-gray-500">Status: Active</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Running
                </span>
                <button className="text-blue-600 hover:text-blue-800">Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: 'analytics',
    label: 'Analytics',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
        <p className="text-gray-600">
          View detailed analytics and performance metrics for your AI agents and workflows.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium mb-4">Performance Trends</h4>
            <div className="h-32 bg-white rounded border flex items-center justify-center">
              <span className="text-gray-400">Chart placeholder</span>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium mb-4">Usage Statistics</h4>
            <div className="h-32 bg-white rounded border flex items-center justify-center">
              <span className="text-gray-400">Chart placeholder</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuration Settings</h3>
        <p className="text-gray-600">
          Configure global settings for your TeamHub workspace and agents.
        </p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter workspace name"
              defaultValue="My TeamHub Workspace"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default AI Model
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>GPT-4</option>
              <option>Claude 3</option>
              <option>DeepSeek</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              id="notifications"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
              Enable email notifications
            </label>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'disabled',
    label: 'Disabled Tab',
    disabled: true,
    content: (
      <div>
        <p>This tab is disabled and should not be accessible.</p>
      </div>
    ),
  },
]

export default function TabsDemo() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TeamHub Tabs Demo</h1>
          <p className="text-gray-600">
            Showcase of the TeamHub tabs component with different variants and features
          </p>
        </div>

        {/* Default Underline Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Underline Variant (Default)</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <TeamHubTabs
              items={tabItems}
              defaultValue="overview"
              variant="underline"
            />
          </div>
        </section>

        {/* Pills Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Pills Variant</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <TeamHubTabs
              items={tabItems.slice(0, 3)} // Show fewer tabs for pills variant
              defaultValue="overview"
              variant="pills"
            />
          </div>
        </section>

        {/* Default Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Default Variant</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <TeamHubTabs
              items={tabItems.slice(0, 3)}
              defaultValue="overview"
              variant="default"
            />
          </div>
        </section>

        {/* Different Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Size Variants</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Small Size</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <TeamHubTabs
                  items={tabItems.slice(0, 3)}
                  defaultValue="overview"
                  variant="underline"
                  size="sm"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Medium Size (Default)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <TeamHubTabs
                  items={tabItems.slice(0, 3)}
                  defaultValue="overview"
                  variant="underline"
                  size="md"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Large Size</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <TeamHubTabs
                  items={tabItems.slice(0, 3)}
                  defaultValue="overview"
                  variant="underline"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎨 Animated Indicator</h3>
              <p className="text-blue-700 text-sm">
                Smooth animated bar that slides to indicate the active tab
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">🎨 TeamHub Colors</h3>
              <p className="text-green-700 text-sm">
                Uses TeamHub design system colors from light-theme-colors.ts
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">⚙️ Multiple Variants</h3>
              <p className="text-purple-700 text-sm">
                Support for underline, pills, and default tab styles
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">📱 Responsive</h3>
              <p className="text-orange-700 text-sm">
                Responsive design that works on all screen sizes
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
