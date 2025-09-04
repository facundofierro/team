'use client'

import { AgelumTabs, type AgelumTabItem } from '@agelum/ux-core'
import {
  BarChart3,
  Bot,
  Settings,
  Eye,
  MessageSquare,
  Activity,
  Database,
  Shield,
  Wrench,
  Server,
} from 'lucide-react'

const tabItems: AgelumTabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: <Eye className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Overview Content</h3>
        <p className="text-gray-600">
          This is the overview tab content. Here you can display general
          information, statistics, or a dashboard-like view.
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
    icon: <Bot className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Agents Management</h3>
        <p className="text-gray-600">
          Manage your AI agents, view their performance, and configure their
          settings.
        </p>
        <div className="space-y-3">
          {['Agent Alpha', 'Agent Beta', 'Agent Gamma'].map((agent, index) => (
            <div
              key={agent}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium">{agent}</div>
                <div className="text-sm text-gray-500">Status: Active</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Running
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  Configure
                </button>
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
    icon: <BarChart3 className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
        <p className="text-gray-600">
          View detailed analytics and performance metrics for your AI agents and
          workflows.
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
    icon: <Settings className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuration Settings</h3>
        <p className="text-gray-600">
          Configure global settings for your Agelum workspace and agents.
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
              defaultValue="My Agelum Workspace"
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
            <label
              htmlFor="notifications"
              className="ml-2 block text-sm text-gray-700"
            >
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
    icon: <Shield className="h-4 w-4" />,
    disabled: true,
    content: (
      <div>
        <p>This tab is disabled and should not be accessible.</p>
      </div>
    ),
  },
]

// Tab items matching the design image
const designTabItems: AgelumTabItem[] = [
  {
    value: 'chat',
    label: 'Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chat Interface</h3>
        <p className="text-gray-600">
          Interactive chat interface for communicating with AI agents.
        </p>
      </div>
    ),
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: <BarChart3 className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
        <p className="text-gray-600">
          Real-time performance monitoring and analytics.
        </p>
      </div>
    ),
  },
  {
    value: 'instances',
    label: 'Instances',
    icon: <Server className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Instance Management</h3>
        <p className="text-gray-600">
          Manage and monitor your AI agent instances.
        </p>
      </div>
    ),
  },
  {
    value: 'tools',
    label: 'Tools',
    icon: <Wrench className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tools & Integrations</h3>
        <p className="text-gray-600">
          Manage tools and integrations for your AI agents.
        </p>
      </div>
    ),
  },
  {
    value: 'configurations',
    label: 'Configurations',
    icon: <Settings className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuration Settings</h3>
        <p className="text-gray-600">
          Configure global settings for your Agelum workspace and agents.
        </p>
      </div>
    ),
  },
]

// Additional tab items for other variants
const chatTabItems: AgelumTabItem[] = [
  {
    value: 'chat',
    label: 'Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chat Interface</h3>
        <p className="text-gray-600">
          Interactive chat interface for communicating with AI agents.
        </p>
      </div>
    ),
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: <Activity className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
        <p className="text-gray-600">
          Real-time performance monitoring and analytics.
        </p>
      </div>
    ),
  },
  {
    value: 'instances',
    label: 'Instances',
    icon: <Database className="h-4 w-4" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Instance Management</h3>
        <p className="text-gray-600">
          Manage and monitor your AI agent instances.
        </p>
      </div>
    ),
  },
]

export default function TabsDemo() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agelum Tabs Demo
          </h1>
          <p className="text-gray-600">
            Showcase of the Agelum tabs component with different variants and
            features
          </p>
        </div>

        {/* Design Match Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Design Match - Navigation Tabs
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <AgelumTabs
              items={designTabItems}
              defaultValue="chat"
              variant="underline"
            />
          </div>
        </section>

        {/* Default Underline Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Underline Variant (Default)
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <AgelumTabs
              items={designTabItems}
              defaultValue="chat"
              variant="underline"
            />
          </div>
        </section>

        {/* Pills Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Pills Variant</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <AgelumTabs
              items={chatTabItems}
              defaultValue="chat"
              variant="pills"
            />
          </div>
        </section>

        {/* Default Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Default Variant
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <AgelumTabs
              items={chatTabItems}
              defaultValue="chat"
              variant="default"
            />
          </div>
        </section>

        {/* Different Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Size Variants</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Small Size
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <AgelumTabs
                  items={chatTabItems}
                  defaultValue="chat"
                  variant="underline"
                  size="sm"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Medium Size (Default)
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <AgelumTabs
                  items={chatTabItems}
                  defaultValue="chat"
                  variant="underline"
                  size="md"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Large Size
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <AgelumTabs
                  items={chatTabItems}
                  defaultValue="chat"
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
              <h3 className="font-medium text-blue-900 mb-2">
                🎨 Gradient Animated Indicator
              </h3>
              <p className="text-blue-700 text-sm">
                Smooth animated bar with purple-to-violet gradient that slides
                to indicate the active tab
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">
                🎨 Agelum Colors
              </h3>
              <p className="text-green-700 text-sm">
                Uses Agelum design system colors with purple-to-violet gradient
                indicators and gray non-selected tabs
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">
                ⚙️ Multiple Variants
              </h3>
              <p className="text-purple-700 text-sm">
                Support for underline, pills, and default tab styles
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">
                📱 Responsive
              </h3>
              <p className="text-orange-700 text-sm">
                Responsive design that works on all screen sizes
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-900 mb-2">
                🎯 Icon Support
              </h3>
              <p className="text-indigo-700 text-sm">
                Optional icons on the left side of each tab for better visual
                identification
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
