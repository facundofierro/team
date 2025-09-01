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
        description: 'Interactive sidebar with navigation and collapsible sections',
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
      {
        name: 'Enhanced Input',
        path: '/components/enhanced-input',
        implemented: true,
        description: 'Styled input with label and optional subtitle',
      },
      {
        name: 'Enhanced Select',
        path: '/components/enhanced-select',
        implemented: false,
        description: 'Styled select dropdown with label and optional subtitle',
      },
      {
        name: 'Enhanced Textarea',
        path: '/components/enhanced-textarea',
        implemented: false,
        description: 'Styled textarea with auto-resize and character count',
      },
      {
        name: 'Form Section',
        path: '/components/form-section',
        implemented: false,
        description: 'Grouped form fields with section title',
      },
      {
        name: 'Form Actions',
        path: '/components/form-actions',
        implemented: false,
        description: 'Action buttons for forms (Save, Reset, etc.)',
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
      {
        name: 'Sidebar',
        path: '/components/sidebar',
        implemented: true,
        description: 'Navigation sidebar with collapsible sections',
      },
      {
        name: 'Layout',
        path: '/components/layout',
        implemented: false,
        description: 'Main layout container with header and sidebar',
      },
      {
        name: 'Page Header',
        path: '/components/page-header',
        implemented: false,
        description: 'Standardized page header component',
      },
      {
        name: 'Content Container',
        path: '/components/content-container',
        implemented: false,
        description: 'Main content area wrapper',
      },
    ],
  },
  {
    name: 'Data Display',
    components: [
      {
        name: 'Status Indicator',
        path: '/components/status-indicator',
        implemented: true,
        description: 'Status badges and indicators',
      },
      {
        name: 'Agent Card',
        path: '/components/agent-card',
        implemented: true,
        description: 'Card component for displaying agent information',
      },
      {
        name: 'Metric Card',
        path: '/components/metric-card',
        implemented: false,
        description: 'Cards for displaying metrics and statistics',
      },
      {
        name: 'Data Table',
        path: '/components/data-table',
        implemented: false,
        description: 'Sortable and filterable data tables',
      },
      {
        name: 'List Item',
        path: '/components/list-item',
        implemented: false,
        description: 'Individual list item components',
      },
      {
        name: 'Empty State',
        path: '/components/empty-state',
        implemented: false,
        description: 'Empty state illustrations and messages',
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
      {
        name: 'Search',
        path: '/components/search',
        implemented: false,
        description: 'Global search component',
      },
    ],
  },
  {
    name: 'Specialized Components',
    components: [
      {
        name: 'Schedule Item',
        path: '/components/schedule-item',
        implemented: false,
        description: 'Scheduled execution item with toggle',
      },
      {
        name: 'Tool Item',
        path: '/components/tool-item',
        implemented: false,
        description: 'Tool assignment item with checkbox',
      },
      {
        name: 'Toggle',
        path: '/components/toggle',
        implemented: false,
        description: 'Simple toggle switch component',
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
          <p className="text-lg text-bg-muted-foreground mb-6">
            Start with Demo Pages to see components working together, then
            explore individual components
          </p>

          {/* Component Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-bg-card border border-bg-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-bg-foreground">2</div>
              <div className="text-sm text-bg-muted-foreground">Demo Pages</div>
            </div>
            <div className="bg-bg-card border border-bg-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-bg-foreground">8</div>
              <div className="text-sm text-bg-muted-foreground">
                Implemented
              </div>
            </div>
            <div className="bg-bg-card border border-bg-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-bg-foreground">25</div>
              <div className="text-sm text-bg-muted-foreground">
                Total Components
              </div>
            </div>
            <div className="bg-bg-card border border-bg-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">32%</div>
              <div className="text-sm text-bg-muted-foreground">Complete</div>
            </div>
          </div>
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
              <div className="space-y-3">
                {category.components.map((component) =>
                  component.implemented ? (
                    <Link
                      key={component.name}
                      href={component.path}
                      className="block p-4 rounded-md bg-bg-accent hover:bg-bg-accent/80 transition-colors text-bg-accent-foreground group"
                    >
                      <div className="font-medium text-bg-accent-foreground group-hover:text-bg-accent-foreground/90">
                        {component.name}
                      </div>
                      {component.description && (
                        <div className="text-sm text-bg-accent-foreground/70 mt-1">
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
