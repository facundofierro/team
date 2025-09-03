'use client'

import { ActiveIndicator } from '@agelum/ux-core'
import { useState } from 'react'

export default function ActiveIndicatorPage() {
  const [isActive, setIsActive] = useState(true)
  const [isActive2, setIsActive2] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Active Indicator Component
          </h1>
          <p className="text-gray-600">
            A beautiful component for showing active/inactive status with toggle
            switches and dots.
          </p>
        </div>

        <div className="space-y-8">
          {/* Variants */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Variants
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Toggle Switch (Default)
                </h3>
                <ActiveIndicator isActive={isActive} onToggle={setIsActive} />
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Dot Indicator
                </h3>
                <ActiveIndicator isActive={isActive2} onToggle={setIsActive2} />
              </div>
            </div>
          </div>

          {/* Interactive Examples */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interactive Examples
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Toggle Switch
                    </h3>
                    <p className="text-sm text-gray-600">
                      Beautiful animated toggle
                    </p>
                  </div>
                  <ActiveIndicator isActive={isActive} onToggle={setIsActive} />
                </div>
                <div className="text-sm text-gray-600">
                  Status:{' '}
                  <span className="font-medium text-gray-900">
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Dot Indicator
                    </h3>
                    <p className="text-sm text-gray-600">
                      Simple dot with text
                    </p>
                  </div>
                  <ActiveIndicator
                    isActive={isActive2}
                    onToggle={setIsActive2}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Status:{' '}
                  <span className="font-medium text-gray-900">
                    {isActive2 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Size Variants */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Size Variants
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Small
                </h3>
                <ActiveIndicator isActive={true} onToggle={() => {}} />
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Medium (Default)
                </h3>
                <ActiveIndicator isActive={true} onToggle={() => {}} />
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Large
                </h3>
                <ActiveIndicator isActive={true} onToggle={() => {}} />
              </div>
            </div>
          </div>

          {/* Real-world Examples */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Real-world Examples
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Database Connection
                    </h3>
                    <p className="text-sm text-gray-600">
                      PostgreSQL main cluster
                    </p>
                  </div>
                  <ActiveIndicator isActive={true} onToggle={() => {}} />
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">API Gateway</h3>
                    <p className="text-sm text-gray-600">
                      External API service
                    </p>
                  </div>
                  <ActiveIndicator isActive={false} onToggle={() => {}} />
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Background Jobs
                    </h3>
                    <p className="text-sm text-gray-600">
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
    </div>
  )
}
