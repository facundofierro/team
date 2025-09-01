'use client'

import { useState } from 'react'

export function AIChatWidget() {
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-pink-500 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <div className="w-96 h-[28rem] bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold">
                AI Business Consultant
              </div>
              <div className="text-gray-400 text-sm">
                Online • Ready to help
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-700/50 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="bg-gray-700/60 rounded-lg p-4 text-white text-sm">
            Hi! I'm your AI business transformation consultant. I can help you
            understand how TeamHub can revolutionize your operations and deliver
            guaranteed ROI. What would you like to explore first?
          </div>

          {/* Quick Replies */}
          <div className="space-y-2">
            {[
              'Analyze My Business',
              'Show Me Examples',
              'Calculate My Savings',
              'How It Works',
            ].map((reply, index) => (
              <button
                key={index}
                className="w-full text-left p-3 bg-gray-700/40 hover:bg-gray-700/60 rounded-lg text-white text-sm transition-colors duration-200"
                onClick={() => console.log('Reply clicked:', reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="text-gray-400 text-xs text-center">
            Powered by TeamHub AI
          </div>
        </div>
      </div>
    </div>
  )
}
