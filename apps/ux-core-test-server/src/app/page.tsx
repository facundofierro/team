'use client'

import Link from 'next/link'

const componentCategories = [
  {
    name: 'Navigation Components',
    components: [
      { name: 'Sidebar', path: '/components/sidebar' },
      { name: 'Navigation Menu', path: '/components/navigation-menu' },
      { name: 'User Profile', path: '/components/user-profile' },
      { name: 'Search', path: '/components/search' },
    ],
  },
  {
    name: 'Layout Components',
    components: [
      { name: 'Layout', path: '/components/layout' },
      { name: 'Page Header', path: '/components/page-header' },
      { name: 'Content Container', path: '/components/content-container' },
    ],
  },
  {
    name: 'Data Display Components',
    components: [
      { name: 'Status Indicator', path: '/components/status-indicator' },
      { name: 'Agent Card', path: '/components/agent-card' },
      { name: 'Metric Card', path: '/components/metric-card' },
      { name: 'Data Table', path: '/components/data-table' },
      { name: 'List Item', path: '/components/list-item' },
      { name: 'Empty State', path: '/components/empty-state' },
    ],
  },
  {
    name: 'Form Components',
    components: [
      { name: 'Form Section', path: '/components/form-section' },
      { name: 'Enhanced Input', path: '/components/enhanced-input' },
      { name: 'Enhanced Select', path: '/components/enhanced-select' },
      { name: 'Toggle', path: '/components/toggle' },
      { name: 'Schedule Item', path: '/components/schedule-item' },
      { name: 'Tool Item', path: '/components/tool-item' },
      { name: 'Form Actions', path: '/components/form-actions' },
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
            Comprehensive test suite for all TeamHub UX Core components
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
                {category.components.map((component) => (
                  <Link
                    key={component.name}
                    href={component.path}
                    className="block p-3 rounded-md bg-bg-accent hover:bg-bg-accent/80 transition-colors text-bg-accent-foreground"
                  >
                    {component.name}
                  </Link>
                ))}
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
