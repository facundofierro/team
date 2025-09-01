'use client'

import { useState } from 'react'
import { StatusIndicator } from '@teamhub/ux-core'

const statuses = [
  'active',
  'inactive',
  'running',
  'stopped',
  'error',
  'warning',
  'pending',
  'idle',
  'offline',
] as const

const sizes = ['sm', 'md', 'lg'] as const

export default function StatusIndicatorTestPage() {
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof statuses)[number]>('active')
  const [selectedSize, setSelectedSize] = useState<(typeof sizes)[number]>('md')
  const [showLabel, setShowLabel] = useState(true)

  return (
    <div className="min-h-screen bg-bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-bg-foreground mb-6">
          Status Indicator Component Test
        </h1>

        <div className="space-y-8">
          {/* Interactive Controls */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Interactive Controls
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-bg-foreground mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as (typeof statuses)[number]
                    )
                  }
                  className="w-full p-2 border border-bg-border rounded-md bg-bg-input text-bg-foreground"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-bg-foreground mb-2">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) =>
                    setSelectedSize(e.target.value as (typeof sizes)[number])
                  }
                  className="w-full p-2 border border-bg-border rounded-md bg-bg-input text-bg-foreground"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLabel"
                  checked={showLabel}
                  onChange={(e) => setShowLabel(e.target.checked)}
                  className="rounded border-bg-border"
                />
                <label
                  htmlFor="showLabel"
                  className="text-sm font-medium text-bg-foreground"
                >
                  Show Label
                </label>
              </div>
            </div>
          </div>

          {/* Current Selection */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Current Selection
            </h2>
            <div className="flex items-center space-x-4">
              <StatusIndicator
                status={selectedStatus}
                size={selectedSize}
                showLabel={showLabel}
              />
              <div className="text-bg-muted-foreground">
                Status: {selectedStatus} | Size: {selectedSize} | Label:{' '}
                {showLabel ? 'On' : 'Off'}
              </div>
            </div>
          </div>

          {/* All Status Types */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              All Status Types (Medium Size)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 border border-bg-border rounded-md"
                >
                  <span className="text-sm font-medium text-bg-foreground capitalize">
                    {status}
                  </span>
                  <StatusIndicator status={status} size="md" showLabel={true} />
                </div>
              ))}
            </div>
          </div>

          {/* All Sizes */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              All Sizes (Active Status)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center justify-between p-3 border border-bg-border rounded-md"
                >
                  <span className="text-sm font-medium text-bg-foreground uppercase">
                    {size}
                  </span>
                  <StatusIndicator
                    status="active"
                    size={size}
                    showLabel={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Without Labels */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Without Labels (Icon Only)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statuses.slice(0, 6).map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 border border-bg-border rounded-md"
                >
                  <span className="text-sm font-medium text-bg-foreground capitalize">
                    {status}
                  </span>
                  <StatusIndicator
                    status={status}
                    size="md"
                    showLabel={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Component Features */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Component Features
            </h2>
            <ul className="space-y-2 text-bg-muted-foreground">
              <li>
                • 9 different status types with appropriate colors and icons
              </li>
              <li>• 3 size variants: small, medium, and large</li>
              <li>• Optional label display</li>
              <li>• Consistent TeamHub design system colors</li>
              <li>• Accessible with proper contrast ratios</li>
              <li>• Responsive design that works on all screen sizes</li>
              <li>• TypeScript support with strict typing</li>
            </ul>
          </div>

          {/* Test Scenarios */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Test Scenarios
            </h2>
            <div className="space-y-2 text-sm text-bg-muted-foreground">
              <div>• Change status types and verify color/icon updates</div>
              <div>• Test different sizes and ensure proper scaling</div>
              <div>• Toggle label visibility</div>
              <div>• Verify accessibility with screen readers</div>
              <div>• Test responsive behavior on mobile devices</div>
              <div>• Check color contrast ratios meet WCAG guidelines</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
