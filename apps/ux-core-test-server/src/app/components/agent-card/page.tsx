'use client'

import { useState } from 'react'
import { AgentCard } from '@teamhub/ux-core'

const sampleAgents = [
  {
    id: 'agent-1',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    status: 'active' as const,
    type: 'chatbot',
    lastActive: '2 minutes ago',
    metrics: {
      conversations: 156,
      satisfaction: 4.8,
      responseTime: '1.2s',
    },
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'agent-2',
    name: 'Data Analyst Agent',
    description: 'Analyzes data and generates reports',
    status: 'idle' as const,
    type: 'analytics',
    lastActive: '1 hour ago',
    metrics: {
      reports: 23,
      accuracy: 98.5,
      processingTime: '5.3s',
    },
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'agent-3',
    name: 'Content Writer Agent',
    description: 'Creates and edits content',
    status: 'error' as const,
    type: 'content',
    lastActive: '5 minutes ago',
    metrics: {
      articles: 45,
      quality: 4.6,
      wordsPerMinute: 120,
    },
    avatar: '/api/placeholder/40/40',
  },
  {
    id: 'agent-4',
    name: 'Code Review Agent',
    description: 'Reviews and suggests code improvements',
    status: 'running' as const,
    type: 'development',
    lastActive: 'Just now',
    metrics: {
      reviews: 89,
      accuracy: 96.2,
      averageTime: '3.1s',
    },
    avatar: '/api/placeholder/40/40',
  },
]

export default function AgentCardTestPage() {
  const [selectedAgent, setSelectedAgent] = useState(sampleAgents[0])
  const [showMetrics, setShowMetrics] = useState(true)
  const [compact, setCompact] = useState(false)

  return (
    <div className="min-h-screen bg-bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-bg-foreground mb-6">
          Agent Card Component Test
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
                  Select Agent
                </label>
                <select
                  value={selectedAgent.id}
                  onChange={(e) => {
                    const agent = sampleAgents.find(
                      (a) => a.id === e.target.value
                    )
                    if (agent) setSelectedAgent(agent)
                  }}
                  className="w-full p-2 border border-bg-border rounded-md bg-bg-input text-bg-foreground"
                >
                  {sampleAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showMetrics"
                  checked={showMetrics}
                  onChange={(e) => setShowMetrics(e.target.checked)}
                  className="rounded border-bg-border"
                />
                <label
                  htmlFor="showMetrics"
                  className="text-sm font-medium text-bg-foreground"
                >
                  Show Metrics
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="compact"
                  checked={compact}
                  onChange={(e) => setCompact(e.target.checked)}
                  className="rounded border-bg-border"
                />
                <label
                  htmlFor="compact"
                  className="text-sm font-medium text-bg-foreground"
                >
                  Compact Mode
                </label>
              </div>
            </div>
          </div>

          {/* Current Selection */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Current Selection
            </h2>
            <div className="max-w-md">
              <AgentCard
                agent={selectedAgent}
                showMetrics={showMetrics}
                compact={compact}
                onEdit={() => console.log('Edit agent:', selectedAgent.id)}
                onDelete={() => console.log('Delete agent:', selectedAgent.id)}
                onToggle={() => console.log('Toggle agent:', selectedAgent.id)}
              />
            </div>
          </div>

          {/* All Agent Types */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              All Agent Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  showMetrics={true}
                  compact={false}
                  onEdit={() => console.log('Edit agent:', agent.id)}
                  onDelete={() => console.log('Delete agent:', agent.id)}
                  onToggle={() => console.log('Toggle agent:', agent.id)}
                />
              ))}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Compact Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  showMetrics={false}
                  compact={true}
                  onEdit={() => console.log('Edit agent:', agent.id)}
                  onDelete={() => console.log('Delete agent:', agent.id)}
                  onToggle={() => console.log('Toggle agent:', agent.id)}
                />
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
                • Displays agent information with avatar, name, and description
              </li>
              <li>• Shows agent status with color-coded indicators</li>
              <li>
                • Optional metrics display with key performance indicators
              </li>
              <li>• Compact mode for list views</li>
              <li>• Action buttons for edit, delete, and toggle operations</li>
              <li>• Responsive design that adapts to different screen sizes</li>
              <li>• Consistent TeamHub design system styling</li>
              <li>• TypeScript support with strict typing</li>
            </ul>
          </div>

          {/* Test Scenarios */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Test Scenarios
            </h2>
            <div className="space-y-2 text-sm text-bg-muted-foreground">
              <div>
                • Switch between different agents and verify display updates
              </div>
              <div>• Toggle metrics visibility and compact mode</div>
              <div>
                • Test action button interactions (edit, delete, toggle)
              </div>
              <div>
                • Verify status indicators show correct colors and states
              </div>
              <div>• Test responsive behavior on mobile and tablet</div>
              <div>• Check accessibility with screen readers</div>
              <div>• Verify hover states and transitions work properly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
