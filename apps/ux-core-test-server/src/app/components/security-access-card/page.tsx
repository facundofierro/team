'use client'

import React, { useState } from 'react'
import { SecurityAccessCard } from '@teamhub/ux-core'

export default function SecurityAccessCardDemo() {
  const [securityLevel1, setSecurityLevel1] = useState('admins-only')
  const [securityLevel2, setSecurityLevel2] = useState('managers')

  const securityOptions = [
    {
      value: 'admins-only',
      label: 'Admins Only',
      description: 'Only administrators can manage this agent',
    },
    {
      value: 'managers',
      label: 'Managers',
      description: 'Managers and administrators can manage this agent',
    },
    {
      value: 'team',
      label: 'Team Members',
      description: 'All team members can manage this agent',
    },
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone with the link can view this agent',
    },
  ]

  const customOptions = [
    {
      value: 'owner',
      label: 'Owner Only',
      description: 'Only the agent owner can manage this agent',
    },
    {
      value: 'admin-team',
      label: 'Admin Team',
      description: 'Members of the admin team can manage this agent',
    },
    {
      value: 'read-only',
      label: 'Read Only',
      description: 'Everyone can view but only admins can edit',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            SecurityAccessCard Component Demo
          </h1>
          <p className="text-gray-600">
            A card for managing security and access permissions with dropdown selection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Standard Security Access Card */}
          <SecurityAccessCard
            value={securityLevel1}
            onChange={setSecurityLevel1}
            options={securityOptions}
          />

          {/* Custom Security Access Card */}
          <SecurityAccessCard
            value={securityLevel2}
            onChange={setSecurityLevel2}
            options={customOptions}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Security Levels
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Card 1</p>
              <p className="text-lg font-bold text-purple-600">
                {securityOptions.find(opt => opt.value === securityLevel1)?.label || securityLevel1}
              </p>
              <p className="text-gray-600 text-xs">
                {securityOptions.find(opt => opt.value === securityLevel1)?.description}
              </p>
            </div>
            <div>
              <p className="font-medium">Card 2</p>
              <p className="text-lg font-bold text-purple-600">
                {customOptions.find(opt => opt.value === securityLevel2)?.label || securityLevel2}
              </p>
              <p className="text-gray-600 text-xs">
                {customOptions.find(opt => opt.value === securityLevel2)?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Security Level Comparison
          </h2>
          <div className="space-y-3">
            {securityOptions.map((option) => (
              <div
                key={option.value}
                className={`p-3 rounded-lg border ${
                  securityLevel1 === option.value
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  {securityLevel1 === option.value && (
                    <span className="text-purple-600 font-medium">Selected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
