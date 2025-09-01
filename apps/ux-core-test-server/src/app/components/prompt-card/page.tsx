'use client'

import React, { useState } from 'react'
import { PromptCard } from '@teamhub/ux-core'

export default function PromptCardDemo() {
  const [prompt1, setPrompt1] = useState(
    'You are an expert AI assistant for construction procurement. Your primary goal is to analyze material costs, manage supplier relationships, and ensure legal compliance in all contracts. You must be precise, data-driven, and proactive in identifying cost-saving opportunities.'
  )
  const [prompt2, setPrompt2] = useState(
    'You are a customer service AI assistant. Help customers with their inquiries, provide accurate information, and escalate complex issues when necessary.'
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            PromptCard Component Demo
          </h1>
          <p className="text-gray-600">
            A card for editing AI agent prompts with character count and AI/Templates buttons.
          </p>
        </div>

        <div className="space-y-6">
          {/* First Prompt Card */}
          <PromptCard
            value={prompt1}
            onChange={setPrompt1}
            maxLength={4000}
            placeholder="Enter your prompt here..."
          />

          {/* Second Prompt Card with different content */}
          <PromptCard
            value={prompt2}
            onChange={setPrompt2}
            maxLength={2000}
            placeholder="Enter customer service prompt..."
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Character Counts
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Prompt 1:</strong> {prompt1.length} / 4000 characters</p>
            <p><strong>Prompt 2:</strong> {prompt2.length} / 2000 characters</p>
          </div>
        </div>
      </div>
    </div>
  )
}
