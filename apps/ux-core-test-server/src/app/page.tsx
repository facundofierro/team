'use client'

import Link from 'next/link'

const componentCategories = [
  {
    name: 'Demo Pages',
    components: [
      {
        name: 'Designs Demo (Full Page)',
        path: '/designs-demo',
        implemented: true,
      },
      {
        name: 'Agent Configuration Page',
        path: '/configuration-demo',
        implemented: true,
      },
    ],
  },
  {
    name: 'Navigation Components',
    components: [
      { name: 'Sidebar', path: '/components/sidebar', implemented: true },
      {
        name: 'Navigation Menu',
        path: '/components/navigation-menu',
        implemented: false,
      },
      {
        name: 'User Profile',
        path: '/components/user-profile',
        implemented: false,
      },
      { name: 'Search', path: '/components/search', implemented: false },
    ],
  },
  {
    name: 'Layout Components',
    components: [
      { name: 'Layout', path: '/components/layout', implemented: false },
      {
        name: 'Page Header',
        path: '/components/page-header',
        implemented: false,
      },
      {
        name: 'Content Container',
        path: '/components/content-container',
        implemented: false,
      },
    ],
  },
  {
    name: 'Data Display Components',
    components: [
      {
        name: 'Status Indicator',
        path: '/components/status-indicator',
        implemented: true,
      },
      { name: 'Agent Card', path: '/components/agent-card', implemented: true },
      {
        name: 'Metric Card',
        path: '/components/metric-card',
        implemented: false,
      },
      {
        name: 'Data Table',
        path: '/components/data-table',
        implemented: false,
      },
      { name: 'List Item', path: '/components/list-item', implemented: false },
      {
        name: 'Empty State',
        path: '/components/empty-state',
        implemented: false,
      },
    ],
  },
  {
    name: 'Form Components',
    components: [
      {
        name: 'Form Section',
        path: '/components/form-section',
        implemented: false,
      },
      {
        name: 'Enhanced Input',
        path: '/components/enhanced-input',
        implemented: true,
      },
      {
        name: 'Enhanced Select',
        path: '/components/enhanced-select',
        implemented: false,
      },
      { name: 'Toggle', path: '/components/toggle', implemented: false },
      {
        name: 'Schedule Item',
        path: '/components/schedule-item',
        implemented: false,
      },
      { name: 'Tool Item', path: '/components/tool-item', implemented: false },
      {
        name: 'Form Actions',
        path: '/components/form-actions',
        implemented: false,
      },
    ],
  },
  {
    name: 'Configuration Components',
    components: [
      {
        name: 'Title With Subtitle',
        path: '/components/title-with-subtitle',
        implemented: true,
      },
      {
        name: 'Configuration Card',
        path: '/components/configuration-card',
        implemented: true,
      },
      {
        name: 'Basic Settings Card',
        path: '/components/basic-settings-card',
        implemented: true,
      },
      {
        name: 'Prompt Card',
        path: '/components/prompt-card',
        implemented: true,
      },
      {
        name: 'Scheduled Executions Card',
        path: '/components/scheduled-executions-card',
        implemented: true,
      },
      {
        name: 'Tool Assignment Card',
        path: '/components/tool-assignment-card',
        implemented: true,
      },
      {
        name: 'Security Access Card',
        path: '/components/security-access-card',
        implemented: true,
      },
    ],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-bg-foreground mb-4">
            TeamHub UX Core - Component Test Suite
          </h1>
          <p className="text-lg text-bg-muted-foreground">
            Start with Demo Pages to see components working together, then
            explore individual components
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {componentCategories.map((category) => (
            <div
              key={category.name}
              className="bg-bg-card border border-bg-border rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-bg-foreground mb-4">
                {category.name}
              </h2>
              <div className="space-y-2">
                {category.components.map((component) =>
                  component.implemented ? (
                    <Link
                      key={component.name}
                      href={component.path}
                      className="block p-3 rounded-md bg-bg-accent hover:bg-bg-accent/80 transition-colors text-bg-accent-foreground"
                    >
                      {component.name}
                    </Link>
                  ) : (
                    <div
                      key={component.name}
                      className="block p-3 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    >
                      {component.name} (Coming Soon)
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-bg-card border border-bg-border rounded-lg">
          <h2 className="text-xl font-semibold text-bg-foreground mb-4">
            Test Commands
          </h2>
          <div className="space-y-2 text-sm font-mono text-bg-muted-foreground">
            <div>pnpm test - Run all tests</div>
            <div>pnpm test:ui - Run tests with UI</div>
            <div>pnpm test:headed - Run tests in headed mode</div>
            <div>pnpm test:debug - Run tests in debug mode</div>
          </div>
        </div>
      </div>
    </div>
  )
}
