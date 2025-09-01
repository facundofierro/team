'use client'

import React, { useState } from 'react'
import { BasicSettingsCard } from '@teamhub/ux-core'

export default function BasicSettingsCardDemo() {
  const [agentName, setAgentName] = useState('Procurement Manager')
  const [roleType, setRoleType] = useState('Manager')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            BasicSettingsCard Component Demo
          </h1>
          <p className="text-gray-600">
            A card for basic agent settings with name and role inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Settings Card */}
          <BasicSettingsCard
            agentName={agentName}
            onAgentNameChange={setAgentName}
            roleType={roleType}
            onRoleTypeChange={setRoleType}
          />

          {/* Card with different values */}
          <BasicSettingsCard
            agentName="AI Assistant"
            onAgentNameChange={setAgentName}
            roleType="Assistant"
            onRoleTypeChange={setRoleType}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Values
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Agent Name:</strong> {agentName}</p>
            <p><strong>Role Type:</strong> {roleType}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
