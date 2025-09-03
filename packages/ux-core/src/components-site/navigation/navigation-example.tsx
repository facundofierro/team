import React from 'react'
import { Header, NavigationMenu } from './index'
import { siteUtils } from '../colors'
import { cn } from '../../utils/cn'

export function NavigationExample() {
  const navigationItems = [
    { label: 'Product', href: '#product' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About Us', href: '#about' },
  ]

  const advancedNavigationItems = [
    {
      label: 'Product',
      children: [
        {
          label: 'AI Agents',
          href: '#ai-agents',
          description: 'Create and manage AI agents',
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ),
        },
        {
          label: 'Analytics',
          href: '#analytics',
          description: 'Track performance and ROI',
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
        {
          label: 'Documentation',
          href: 'https://docs.teamhub.ai',
          description: 'API docs and guides',
          external: true,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      label: 'Solutions',
      children: [
        {
          label: 'Enterprise',
          href: '#enterprise',
          description: 'Large-scale deployments',
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
        },
        {
          label: 'Startup',
          href: '#startup',
          description: 'Fast-growing teams',
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
        },
      ],
    },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with basic navigation */}
      <Header
        navigationItems={navigationItems}
        ctaText="Get Started"
        onCtaClick={() => console.log('Get Started clicked')}
      />

      {/* Content section to demonstrate sticky behavior */}
      <div className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Navigation Components Demo
          </h1>

          {/* Basic Navigation Menu */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Basic Navigation Menu
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <NavigationMenu items={navigationItems} />
            </div>
          </div>

          {/* Advanced Navigation Menu with Dropdowns */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Advanced Navigation Menu with Dropdowns
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <NavigationMenu items={advancedNavigationItems} />
            </div>
          </div>

          {/* Vertical Navigation Menu */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Vertical Navigation Menu
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <NavigationMenu
                items={navigationItems}
                variant="vertical"
                size="lg"
              />
            </div>
          </div>

          {/* Transparent Header Example */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Transparent Header (for hero sections)
            </h2>
            <div
              className={cn(
                'relative h-32 rounded-lg overflow-hidden',
                siteUtils.getGradientClasses('primary')
              )}
            >
              <Header
                transparent
                sticky={false}
                navigationItems={navigationItems}
                ctaText="Try Free"
                onCtaClick={() => console.log('Try Free clicked')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
