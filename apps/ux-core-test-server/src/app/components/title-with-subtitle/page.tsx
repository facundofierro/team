'use client'

import React from 'react'
import { TitleWithSubtitle } from '@teamhub/ux-core'

export default function TitleWithSubtitleDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            TitleWithSubtitle Component Demo
          </h1>
          <p className="text-gray-600">
            A simple component for displaying titles with optional subtitles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TitleWithSubtitle
            title="Procurement Manager"
            subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TitleWithSubtitle
            title="AI Assistant"
            subtitle="Intelligent agent for customer support and data analysis."
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TitleWithSubtitle
            title="Data Processor"
            subtitle="Automated data cleaning and analysis workflow."
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TitleWithSubtitle title="Simple Title Only" />
        </div>
      </div>
    </div>
  )
}
