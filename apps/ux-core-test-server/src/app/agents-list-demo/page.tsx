'use client'

import React, { useState } from 'react'
import { AgentsList, type Agent, coreColors } from '@teamhub/ux-core'
import { elegantColors } from '@teamhub/ux-core'

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
    <div
      className="min-h-screen"
      style={{ backgroundColor: elegantColors.primary[300] }}
    >
      <div className="flex h-screen">
        {/* Left side - AgentsList Component */}
        <div className="w-[480px] p-6 flex items-center justify-center">
          <AgentsList
            agents={sampleAgents}
            onAgentSelect={handleAgentSelect}
            onAgentCreate={handleAgentCreate}
            selectedAgentId={selectedAgent?.id}
            showHierarchical={true}
            showSearch={true}
            showActionButtons={true}
            className="w-full h-full"
          />
        </div>

        {/* Right side - Explanatory Content */}
        <div className="flex-1 p-8 bg-white">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              AgentsList Component
            </h1>

            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-xl font-semibold text-gray-800">
                  Interactive Features
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                      <strong>Search/Filter Toggle:</strong> Switch between
                      search mode and status filter mode
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                      <strong>List/Tree View:</strong> Toggle between flat list
                      and hierarchical tree view
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                      <strong>Status Filtering:</strong> Filter agents by All,
                      On, Idle, or Off status
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                      <strong>Expand/Collapse:</strong> In tree mode, expand
                      parent agents to see children
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                      <strong>Agent Selection:</strong> Click any agent to
                      select it
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold text-gray-800">
                  Design System
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>
                      <strong>TeamHub Colors:</strong> Uses consistent color
                      palette from light-theme-colors.ts
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>
                      <strong>Status Indicators:</strong> Green (active), Yellow
                      (idle), Grey (offline)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>
                      <strong>Responsive Design:</strong> Adapts to different
                      screen sizes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>
                      <strong>Accessibility:</strong> Keyboard navigation and
                      ARIA labels
                    </span>
                  </li>
                </ul>
              </div>

              {selectedAgent && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">
                    Selected Agent
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedAgent.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`ml-2 capitalize ${
                          selectedAgent.status === 'active'
                            ? 'text-green-600'
                            : selectedAgent.status === 'idle'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {selectedAgent.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Description:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedAgent.description}
                      </span>
                    </div>
                    {selectedAgent.children &&
                      selectedAgent.children.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Child Agents:
                          </span>
                          <ul className="mt-1 ml-2">
                            {selectedAgent.children.map((child) => (
                              <li key={child.id} className="text-gray-600">
                                • {child.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              <div>
                <h2 className="mb-3 text-xl font-semibold text-gray-800">
                  Component Props
                </h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="overflow-x-auto text-sm text-gray-700">
                    {`<AgentsList
  agents={sampleAgents}
  onAgentSelect={handleAgentSelect}
  onAgentCreate={handleAgentCreate}
  selectedAgentId={selectedAgent?.id}
  showHierarchical={true}
  showSearch={true}
  showActionButtons={true}
/>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
