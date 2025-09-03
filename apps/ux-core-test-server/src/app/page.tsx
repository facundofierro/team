'use client'

import Link from 'next/link'

const componentCategories = [
  {
    name: 'Demo Pages',
    components: [
      {
        name: 'Configuration Demo',
        path: '/configuration-demo',
        implemented: true,
        description:
          'Full configuration page with all components working together',
      },
      {
        name: 'Sidebar Demo',
        path: '/sidebar-demo',
        implemented: true,
        description:
          'Interactive sidebar with navigation and collapsible sections',
      },
      {
        name: 'Agents List Demo',
        path: '/agents-list-demo',
        implemented: true,
        description:
          'Interactive agents list with search, filtering, and hierarchical view',
      },
      {
        name: 'Tabs Demo',
        path: '/tabs-demo',
        implemented: true,
        description:
          'Agelum tabs component with animated indicators and multiple variants',
      },
    ],
  },
  {
    name: 'Form Components',
    components: [
      {
        name: 'Form Card',
        path: '/components/form-card',
        implemented: true,
        description: 'Main container for form sections with header and footer',
      },
    ],
  },
  {
    name: 'Button Components',
    components: [
      {
        name: 'Button Variants',
        path: '/components/button-variants',
        implemented: true,
        description: 'All button types: Primary, Action, Tertiary, Ghost',
      },
      {
        name: 'Active Indicator',
        path: '/components/active-indicator',
        implemented: true,
        description: 'Toggle switch with animated state changes',
      },
    ],
  },
  {
    name: 'Layout Components',
    components: [
      {
        name: 'Title With Subtitle',
        path: '/components/title-with-subtitle',
        implemented: true,
        description: 'Page headers with title and subtitle',
      },
    ],
  },

  {
    name: 'Navigation & User',
    components: [
      {
        name: 'Navigation Menu',
        path: '/components/navigation-menu',
        implemented: false,
        description: 'Top navigation menu component',
      },
      {
        name: 'User Profile',
        path: '/components/user-profile',
        implemented: false,
        description: 'User profile display and menu',
      },
    ],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agelum UX Core - Component Test Suite
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Start with Demo Pages to see components working together, then
            explore individual components
          </p>

          {/* Component Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">Demo Pages</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Implemented</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-600">Total Components</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">71%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {componentCategories.map((category) => (
            <div
              key={category.name}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.components.map((component) =>
                  component.implemented ? (
                    <Link
                      key={component.name}
                      href={component.path}
                      className="block p-4 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors text-purple-900 group"
                    >
                      <div className="font-medium text-purple-900 group-hover:text-purple-800">
                        {component.name}
                      </div>
                      {component.description && (
                        <div className="text-sm text-purple-700 mt-1">
                          {component.description}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div
                      key={component.name}
                      className="block p-4 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                    >
                      <div className="font-medium">
                        {component.name}{' '}
                        <span className="text-xs">(Coming Soon)</span>
                      </div>
                      {component.description && (
                        <div className="text-sm text-gray-400/70 mt-1">
                          {component.description}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Commands
          </h2>
          <div className="space-y-2 text-sm font-mono text-gray-600">
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
