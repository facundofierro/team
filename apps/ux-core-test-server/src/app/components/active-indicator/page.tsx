'use client'

import { ActiveIndicator } from '@teamhub/ux-core'
import { useState } from 'react'

export default function ActiveIndicatorPage() {
  const [isActive, setIsActive] = useState(true)
  const [isActive2, setIsActive2] = useState(false)

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Active Indicator Component</h1>
        <p className="text-muted-foreground">
          A beautiful component for showing active/inactive status with toggle
          switches and dots.
        </p>
      </div>

      <div className="space-y-8">
        {/* Variants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Variants</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">
                Toggle Switch (Default)
              </h3>
              <ActiveIndicator isActive={isActive} onToggle={setIsActive} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Dot Indicator</h3>
              <ActiveIndicator isActive={isActive2} onToggle={setIsActive2} />
            </div>
          </div>
        </div>

        {/* Interactive Examples */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Interactive Examples</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Toggle Switch</h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful animated toggle
                  </p>
                </div>
                <ActiveIndicator isActive={isActive} onToggle={setIsActive} />
              </div>
              <div className="text-sm text-muted-foreground">
                Status:{' '}
                <span className="font-medium">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-6 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Dot Indicator</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple dot with text
                  </p>
                </div>
                <ActiveIndicator isActive={isActive2} onToggle={setIsActive2} />
              </div>
              <div className="text-sm text-muted-foreground">
                Status:{' '}
                <span className="font-medium">
                  {isActive2 ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Size Variants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Small</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Medium (Default)</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Large</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Custom Text */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Custom Text</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Custom Active Text</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Custom Inactive Text</h3>
              <ActiveIndicator isActive={false} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Icon Only */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Icon Only (No Text)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Toggle Only</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Dot Only</h3>
              <ActiveIndicator isActive={false} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Static Examples */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Static Examples (No Toggle)
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Active Toggle</h3>
              <ActiveIndicator isActive={true} onToggle={() => {}} />
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Inactive Toggle</h3>
              <ActiveIndicator isActive={false} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Real-world Examples */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Real-world Examples</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Database Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL main cluster
                  </p>
                </div>
                <ActiveIndicator isActive={true} onToggle={() => {}} />
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">API Gateway</h3>
                  <p className="text-sm text-muted-foreground">
                    External API service
                  </p>
                </div>
                <ActiveIndicator isActive={false} onToggle={() => {}} />
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Background Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Email processing queue
                  </p>
                </div>
                <ActiveIndicator isActive={true} onToggle={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
