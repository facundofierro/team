'use client'

import { FormCard } from '@teamhub/ux-core'
import { Sparkles, FileText, Settings, Shield } from 'lucide-react'

export default function FormCardPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Form Card Component</h1>
        <p className="text-muted-foreground">
          A flexible card component for forms with header, content, and footer
          sections.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Form Card */}
        <FormCard title="Basic Settings">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                rows={3}
                placeholder="Enter description"
              />
            </div>
          </div>
        </FormCard>

        {/* Form Card with Icon */}
        <FormCard
          title="Security Settings"
          subtitle="Configure access permissions"
          icon={Shield}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="admin" />
              <label htmlFor="admin" className="text-sm">
                Admin access only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="public" />
              <label htmlFor="public" className="text-sm">
                Public access
              </label>
            </div>
          </div>
        </FormCard>

        {/* Form Card with Header Content */}
        <FormCard
          title="AI Configuration"
          headerContent={
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                <Sparkles className="w-4 h-4" />
                <span>AI</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-accent">
                <FileText className="w-4 h-4" />
                <span>Templates</span>
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Model</label>
              <select className="w-full mt-1 px-3 py-2 border border-border rounded-md">
                <option>GPT-4</option>
                <option>GPT-3.5</option>
                <option>Claude</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="w-full mt-1"
              />
            </div>
          </div>
        </FormCard>

        {/* Form Card with Footer */}
        <FormCard
          title="Advanced Settings"
          icon={Settings}
          footerContent={
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Last updated: 2 hours ago
              </span>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cache Duration</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                placeholder="300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Retries</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                placeholder="3"
              />
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  )
}
