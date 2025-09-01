'use client'

import {
  PrimaryButton,
  ActionButton,
  TertiaryButton,
  GhostButton,
  SaveButton,
  ResetButton,
  AddButton,
} from '@teamhub/ux-core'
import { Sparkles, Plus, FileText, Settings } from 'lucide-react'

export default function ButtonVariantsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Button Variants</h1>
        <p className="text-gray-600">
          All button types available in the TeamHub UX Core library
        </p>
      </div>

      {/* Primary Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Primary Buttons</h2>
        <p className="text-gray-600">
          Main action buttons with gradient background for primary actions
        </p>
        <div className="flex flex-wrap gap-4">
          <PrimaryButton>Primary Button</PrimaryButton>
          <PrimaryButton icon={Sparkles}>With Icon</PrimaryButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
          <SaveButton />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Action Buttons</h2>
        <p className="text-gray-600">
          Solid background buttons for secondary actions
        </p>
        <div className="flex flex-wrap gap-4">
          <ActionButton>Action Button</ActionButton>
          <ActionButton icon={Plus}>With Icon</ActionButton>
          <ActionButton disabled>Disabled</ActionButton>
          <AddButton>Add Tool</AddButton>
        </div>
      </div>

      {/* Tertiary Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tertiary Buttons</h2>
        <p className="text-gray-600">
          Outline style buttons for tertiary actions
        </p>
        <div className="flex flex-wrap gap-4">
          <TertiaryButton>Tertiary Button</TertiaryButton>
          <TertiaryButton icon={FileText}>With Icon</TertiaryButton>
          <TertiaryButton disabled>Disabled</TertiaryButton>
          <ResetButton />
        </div>
      </div>

      {/* Ghost Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Ghost Buttons</h2>
        <p className="text-gray-600">
          Transparent background buttons for subtle actions
        </p>
        <div className="flex flex-wrap gap-4">
          <GhostButton>Ghost Button</GhostButton>
          <GhostButton icon={Settings}>With Icon</GhostButton>
          <GhostButton disabled>Disabled</GhostButton>
        </div>
      </div>

      {/* Button Sizes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <p className="text-gray-600">
          Different sizes available for various use cases
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButton className="px-3 py-1.5 text-xs">Small</PrimaryButton>
          <PrimaryButton className="px-4 py-2 text-sm">Medium</PrimaryButton>
          <PrimaryButton className="px-6 py-3 text-base">Large</PrimaryButton>
        </div>
      </div>

      {/* Interactive Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Examples</h2>
        <p className="text-gray-600">
          Buttons in action with different states and behaviors
        </p>
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 mb-4">
            <SaveButton />
            <ResetButton />
            <AddButton>Add Tool</AddButton>
            <GhostButton icon={FileText}>Templates</GhostButton>
          </div>
          <p className="text-sm text-gray-500">
            Click any button to see the focus effect and hover states
          </p>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Primary Buttons
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use for main actions (Save, Submit, Create)</li>
              <li>• Only one primary button per section</li>
              <li>• Gradient background draws attention</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              Action Buttons
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Use for secondary actions (Add, Edit, Delete)</li>
              <li>• Solid background for clear action</li>
              <li>• Can have multiple per section</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Tertiary Buttons
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Use for cancel, reset, or alternative actions</li>
              <li>• Outline style for less emphasis</li>
              <li>• Good for destructive actions</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">
              Ghost Buttons
            </h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Use for subtle actions (View, More, Options)</li>
              <li>• Transparent background blends in</li>
              <li>• Good for navigation or toggles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
