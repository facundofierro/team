'use client'

import React, { useState } from 'react'
import { AgentsList, type Agent } from '@teamhub/ux-core'

// Sample agents data that matches the design
const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Procurement Manager',
    description: 'Materials sourcing and supplier management',
    status: 'active',
    avatar: 'PM',
    children: [
      {
        id: '2',
        name: 'Material Sourcer',
        description: 'Finds and evaluates construction materials',
        status: 'active',
        avatar: 'MS',
        parentId: '1',
      },
      {
        id: '3',
        name: 'Vendor Negotiator',
        description: 'Negotiates contracts with suppliers',
        status: 'idle',
        avatar: 'VN',
        parentId: '1',
      },
    ],
  },
  {
    id: '4',
    name: 'Business Development',
    description: 'Client acquisition and market research',
    status: 'idle',
    avatar: 'BD',
    children: [
      {
        id: '5',
        name: 'Lead Generator',
        description: 'Identifies potential commercial clients',
        status: 'active',
        avatar: 'LG',
        parentId: '4',
      },
    ],
  },
  {
    id: '6',
    name: 'Contract Specialist',
    description: 'Contract drafting and legal compliance',
    status: 'active',
    avatar: 'CS',
  },
  {
    id: '7',
    name: 'HR Manager',
    description: 'Employee management and workforce planning',
    status: 'offline',
    avatar: 'HR',
    children: [
      {
        id: '8',
        name: 'Recruiter',
        description: 'Finds skilled construction workers',
        status: 'offline',
        avatar: 'R',
        parentId: '7',
      },
    ],
  },
]

export default function AgentsListDemo() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    console.log('Selected agent:', agent)
  }

  const handleAgentCreate = () => {
    console.log('Create new agent clicked')
    alert('Create new agent functionality would be implemented here')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AgentsList Component Demo
          </h1>
          <p className="text-gray-600">
            Demonstration of the AgentsList component with various features and
            interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Demo */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Full Featured AgentsList
            </h2>
            <AgentsList
              agents={sampleAgents}
              onAgentSelect={handleAgentSelect}
              onAgentCreate={handleAgentCreate}
              selectedAgentId={selectedAgent?.id}
              showHierarchical={true}
              showSearch={true}
              showActionButtons={true}
            />
          </div>

          {/* Simplified Demo */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Simplified AgentsList
            </h2>
            <AgentsList
              agents={sampleAgents.slice(0, 3)}
              onAgentSelect={handleAgentSelect}
              selectedAgentId={selectedAgent?.id}
              showHierarchical={false}
              showSearch={false}
              showActionButtons={false}
              className="max-h-80"
            />
          </div>
        </div>

        {/* Selected Agent Info */}
        {selectedAgent && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Agent Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{selectedAgent.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <p
                  className={`capitalize ${
                    selectedAgent.status === 'active'
                      ? 'text-green-600'
                      : selectedAgent.status === 'idle'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {selectedAgent.status}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{selectedAgent.description}</p>
              </div>
              {selectedAgent.children && selectedAgent.children.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Agents
                  </label>
                  <ul className="list-disc list-inside text-gray-900">
                    {selectedAgent.children.map((child) => (
                      <li key={child.id}>{child.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Component Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Component Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Core Features:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Agent filtering by status (All, On, Idle, Off)</li>
                <li>• Real-time search functionality</li>
                <li>• Hierarchical view with expand/collapse</li>
                <li>• Status indicators with colored dots</li>
                <li>• Selection state management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">
                UI/UX Features:
              </h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Smooth hover and transition effects</li>
                <li>• Responsive design</li>
                <li>• Accessible keyboard navigation</li>
                <li>• TeamHub color system integration</li>
                <li>• Configurable display options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
