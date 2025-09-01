'use client'

import { FormCard, GhostButton, ActionButton } from '@teamhub/ux-core'
import { Sparkles, FileText, Settings, Shield, Plus, Save } from 'lucide-react'

export default function FormCardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form Card Component
          </h1>
          <p className="text-gray-600">
            A flexible card component for forms with header, content, and footer
            sections. Showcases different header configurations with buttons and
            icons.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Form Card - No Header Options */}
          <FormCard title="Basic Settings">
            <div className="text-gray-500 text-sm">
              This card has a simple title with no additional header options.
            </div>
          </FormCard>

          {/* Form Card with Icon Only */}
          <FormCard title="Security Settings" icon={Shield}>
            <div className="text-gray-500 text-sm">
              This card includes an icon in the header alongside the title.
            </div>
          </FormCard>

          {/* Form Card with Header Buttons */}
          <FormCard
            title="AI Configuration"
            headerContent={
              <div className="flex space-x-2">
                <GhostButton icon={Sparkles}>AI</GhostButton>
                <GhostButton icon={FileText}>Templates</GhostButton>
              </div>
            }
          >
            <div className="text-gray-500 text-sm">
              This card has header buttons using our GhostButton components.
            </div>
          </FormCard>

          {/* Form Card with Icon and Header Button */}
          <FormCard
            title="Advanced Settings"
            icon={Settings}
            headerContent={<ActionButton icon={Plus}>Add Setting</ActionButton>}
          >
            <div className="text-gray-500 text-sm">
              This card combines an icon with a header action button.
            </div>
          </FormCard>

          {/* Form Card with Multiple Header Options */}
          <FormCard
            title="Tool Configuration"
            icon={Shield}
            headerContent={
              <div className="flex space-x-2">
                <GhostButton icon={FileText}>Templates</GhostButton>
                <ActionButton icon={Plus}>Add Tool</ActionButton>
              </div>
            }
          >
            <div className="text-gray-500 text-sm">
              This card demonstrates multiple header options: icon + multiple
              buttons.
            </div>
          </FormCard>

          {/* Form Card with Footer */}
          <FormCard
            title="Settings with Footer"
            footerContent={
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Last updated: 2 hours ago
                </span>
                <ActionButton icon={Save}>Save Changes</ActionButton>
              </div>
            }
          >
            <div className="text-gray-500 text-sm">
              This card includes a footer section with additional information
              and actions.
            </div>
          </FormCard>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Usage Examples
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Basic Form Card
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <pre>{`<FormCard title="Basic Settings">
  {/* Your form content */}
</FormCard>`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">With Icon</h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <pre>{`<FormCard title="Security Settings" icon={Shield}>
  {/* Your form content */}
</FormCard>`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                With Header Buttons
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <pre>{`<FormCard
  title="AI Configuration"
  headerContent={
    <div className="flex space-x-2">
      <GhostButton icon={Sparkles}>AI</GhostButton>
      <GhostButton icon={FileText}>Templates</GhostButton>
    </div>
  }
>
  {/* Your form content */}
</FormCard>`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">With Footer</h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <pre>{`<FormCard
  title="Settings"
  footerContent={
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">Last updated: 2 hours ago</span>
      <ActionButton icon={Save}>Save Changes</ActionButton>
    </div>
  }
>
  {/* Your form content */}
</FormCard>`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
