'use client'

import React, { useState } from 'react'
import { ToolAssignmentCard } from '@teamhub/ux-core'

export default function ToolAssignmentCardDemo() {
  const [tools, setTools] = useState([
    {
      id: '1',
      name: 'Database Query',
      description: 'Execute SQL queries on connected databases.',
      type: 'database',
      enabled: true,
    },
    {
      id: '2',
      name: 'Document Analyzer',
      description: 'Extract info from PDF and DOCX files.',
      type: 'document',
      enabled: true,
    },
    {
      id: '3',
      name: 'Web Scraper',
      description: 'Extract data from websites and web pages.',
      type: 'api',
      enabled: false,
    },
    {
      id: '4',
      name: 'Email Sender',
      description: 'Send automated emails and notifications.',
      type: 'api',
      enabled: false,
    },
  ])

  const handleAddTool = () => {
    const newTool = {
      id: Date.now().toString(),
      name: 'New Tool',
      description: 'Tool description',
      type: 'api',
      enabled: false,
    }
    setTools([...tools, newTool])
  }

  const handleToggleTool = (id: string, enabled: boolean) => {
    setTools(
      tools.map((tool) => (tool.id === id ? { ...tool, enabled } : tool))
    )
  }

  const handleRemoveTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ToolAssignmentCard Component Demo
          </h1>
          <p className="text-gray-600">
            A card for managing tool assignments with checkboxes and remove functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool Assignment Card */}
          <ToolAssignmentCard
            tools={tools}
            onAddTool={handleAddTool}
            onToggleTool={handleToggleTool}
            onRemoveTool={handleRemoveTool}
          />

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Empty State Demo
            </h2>
            <ToolAssignmentCard
              tools={[]}
              onAddTool={handleAddTool}
              onToggleTool={handleToggleTool}
              onRemoveTool={handleRemoveTool}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tool Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Total Tools</p>
              <p className="text-2xl font-bold text-purple-600">{tools.length}</p>
            </div>
            <div>
              <p className="font-medium">Enabled</p>
              <p className="text-2xl font-bold text-green-600">
                {tools.filter(t => t.enabled).length}
              </p>
            </div>
            <div>
              <p className="font-medium">Disabled</p>
              <p className="text-2xl font-bold text-gray-600">
                {tools.filter(t => !t.enabled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tool Types
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Database Tools</p>
              <p className="text-lg font-bold text-blue-600">
                {tools.filter(t => t.type === 'database').length}
              </p>
            </div>
            <div>
              <p className="font-medium">API Tools</p>
              <p className="text-lg font-bold text-orange-600">
                {tools.filter(t => t.type === 'api').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
