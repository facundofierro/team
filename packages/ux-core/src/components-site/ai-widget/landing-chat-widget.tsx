'use client'

import { useState } from 'react'
import { siteColors, siteUtils } from '../colors'

interface QuickReply {
  text: string
  action?: () => void
}

interface LandingChatWidgetProps {
  title?: string
  subtitle?: string
  initialMessage?: string
  quickReplies?: QuickReply[]
  onQuickReplyClick?: (reply: string) => void
  onMinimize?: () => void
  onExpand?: () => void
  isMinimized?: boolean
}

export function LandingChatWidget({
  title = 'AI Business Consultant',
  subtitle = 'Online • Ready to help',
  initialMessage = "Hi! I'm your AI business transformation consultant. I can help you understand how Agelum can revolutionize your operations and deliver guaranteed ROI. What would you like to explore first?",
  quickReplies = [
    { text: 'Analyze My Business' },
    { text: 'Show Me Examples' },
    { text: 'Calculate My Savings' },
    { text: 'How It Works' },
  ],
  onQuickReplyClick,
  onMinimize,
  onExpand,
  isMinimized: controlledMinimized,
}: LandingChatWidgetProps) {
  const [internalMinimized, setInternalMinimized] = useState(false)

  // Use controlled prop if provided, otherwise use internal state
  const isMinimized =
    controlledMinimized !== undefined ? controlledMinimized : internalMinimized

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize()
    } else {
      setInternalMinimized(true)
    }
  }

  const handleExpand = () => {
    if (onExpand) {
      onExpand()
    } else {
      setInternalMinimized(false)
    }
  }

  const handleQuickReplyClick = (reply: string) => {
    if (onQuickReplyClick) {
      onQuickReplyClick(reply)
    } else {
      console.log('Reply clicked:', reply)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={handleExpand}
          className={`w-16 h-16 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 flex items-center justify-center ${siteUtils.getButtonClasses(
            'cta'
          )}`}
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
    <>
      {/* Desktop Chat Widget */}
      <div className="fixed left-4 top-16 z-40 hidden lg:block">
        <div
          className={`w-[22rem] h-[calc(100vh-5rem)] max-h-[42rem] bg-gray-800/90 backdrop-blur-md rounded-2xl border ${siteColors.borders.gray700} shadow-xl flex flex-col`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${siteColors.borders.gray700}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${siteUtils.getButtonClasses(
                  'cta'
                )}`}
              >
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
                <div className="text-white font-semibold">{title}</div>
                <div className={`${siteColors.text.gray400} text-sm`}>
                  {subtitle}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${siteColors.text.gray400}`}
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
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-gray-700/60 rounded-lg p-4 text-white text-sm leading-relaxed">
              {initialMessage}
            </div>

            {/* Quick Replies */}
            <div className="space-y-3">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 bg-gray-700/40 hover:bg-gray-700/60 rounded-lg text-white text-sm transition-colors duration-200 border border-gray-600/30 hover:border-gray-500/50"
                  onClick={() =>
                    reply.action
                      ? reply.action()
                      : handleQuickReplyClick(reply.text)
                  }
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${siteColors.borders.gray700}`}>
            <div className={`${siteColors.text.gray400} text-xs text-center`}>
              Powered by Agelum AI
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Widget */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <div
          className={`w-80 h-96 bg-gray-800/90 backdrop-blur-md rounded-2xl border ${siteColors.borders.gray700} shadow-xl flex flex-col`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${siteColors.borders.gray700}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${siteUtils.getButtonClasses(
                  'cta'
                )}`}
              >
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
                <div className="text-white font-semibold">{title}</div>
                <div className={`${siteColors.text.gray400} text-sm`}>
                  {subtitle}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${siteColors.text.gray400}`}
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
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-gray-700/60 rounded-lg p-4 text-white text-sm leading-relaxed">
              {initialMessage}
            </div>

            {/* Quick Replies */}
            <div className="space-y-3">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 bg-gray-700/40 hover:bg-gray-700/60 rounded-lg text-white text-sm transition-colors duration-200 border border-gray-600/30 hover:border-gray-500/50"
                  onClick={() =>
                    reply.action
                      ? reply.action()
                      : handleQuickReplyClick(reply.text)
                  }
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${siteColors.borders.gray700}`}>
            <div className={`${siteColors.text.gray400} text-xs text-center`}>
              Powered by Agelum AI
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
