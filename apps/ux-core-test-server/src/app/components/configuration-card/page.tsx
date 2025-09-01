'use client'

import React from 'react'
import { ConfigurationCard, ConfigButton } from '@teamhub/ux-core'
import { Plus, Settings, Database, FileText, Shield } from 'lucide-react'

export default function ConfigurationCardDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ConfigurationCard Component Demo
          </h1>
          <p className="text-gray-600">
            A generic card component that supports title, subtitle, icon, header
            actions, and footer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Card */}
          <ConfigurationCard title="Basic Settings">
            <p className="text-gray-600">
              This is a basic configuration card with just a title.
            </p>
          </ConfigurationCard>

          {/* Card with Icon */}
          <ConfigurationCard
            title="Database Settings"
            subtitle="Configure database connections and queries"
            icon={Database}
          >
            <p className="text-gray-600">Card with icon and subtitle.</p>
          </ConfigurationCard>

          {/* Card with Header Action */}
          <ConfigurationCard
            title="File Management"
            subtitle="Manage uploaded files and documents"
            icon={FileText}
            headerAction={
              <ConfigButton variant="primary" size="sm" icon={Plus}>
                Add File
              </ConfigButton>
            }
          >
            <p className="text-gray-600">Card with header action button.</p>
          </ConfigurationCard>

          {/* Card with Footer */}
          <ConfigurationCard
            title="Security Settings"
            subtitle="Configure security and access permissions"
            icon={Shield}
            footer={
              <p className="text-sm text-gray-500">
                Changes will take effect immediately
              </p>
            }
          >
            <p className="text-gray-600">Card with footer text.</p>
          </ConfigurationCard>

          {/* Complex Card */}
          <div className="lg:col-span-2">
            <ConfigurationCard
              title="Advanced Configuration"
              subtitle="Configure advanced settings and options"
              icon={Settings}
              headerAction={
                <div className="flex items-center space-x-2">
                  <ConfigButton variant="secondary" size="sm">
                    Reset
                  </ConfigButton>
                  <ConfigButton variant="primary" size="sm" icon={Plus}>
                    Add Option
                  </ConfigButton>
                </div>
              }
              footer={
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Configuration saved automatically
                  </p>
                  <ConfigButton variant="outline" size="sm">
                    Export Config
                  </ConfigButton>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-600">
                  This is a complex card with multiple header actions and a
                  detailed footer.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium text-gray-900">Option 1</h4>
                    <p className="text-sm text-gray-600">
                      First configuration option
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium text-gray-900">Option 2</h4>
                    <p className="text-sm text-gray-600">
                      Second configuration option
                    </p>
                  </div>
                </div>
              </div>
            </ConfigurationCard>
          </div>
        </div>
      </div>
    </div>
  )
}
