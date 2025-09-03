'use client'

import { useState, useRef, useEffect } from 'react'
import { siteColors, siteUtils } from '../colors'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

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
  title,
  subtitle,
  initialMessage,
  quickReplies,
  onQuickReplyClick,
  onMinimize,
  onExpand,
  isMinimized: controlledMinimized,
}: LandingChatWidgetProps) {
  const [internalMinimized, setInternalMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: initialMessage || '',
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isMinimized = controlledMinimized ?? internalMinimized

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput: string): string => {
    // Simple response logic - you can make this more sophisticated
    const responses = [
      "That's a great question! Let me help you understand how our AI agents can transform your business operations.",
      "Based on your interest, I'd recommend starting with our free AI readiness assessment to identify the best opportunities.",
      'Many businesses see 25-40% cost reductions in their first year. Would you like to explore how this applies to your specific situation?',
      "I can help you calculate your potential ROI. What's your current monthly operational budget for the areas you'd like to optimize?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleQuickReplyClick = (replyText: string) => {
    if (onQuickReplyClick) {
      onQuickReplyClick(replyText)
    }
    setInputValue(replyText)
    handleSendMessage()
  }

  const toggleMinimize = () => {
    const newMinimized = !isMinimized
    setInternalMinimized(newMinimized)
    if (newMinimized && onMinimize) {
      onMinimize()
    } else if (!newMinimized && onExpand) {
      onExpand()
    }
  }

  return (
    <div className="relative">
      {/* Desktop Chat Widget */}
      <div className="hidden fixed left-4 top-16 z-40 lg:block">
        <div
          className={`flex flex-col rounded-2xl border shadow-2xl backdrop-blur-xl w-[24rem] h-[calc(100vh-5rem)] max-h-[48rem]`}
          style={{
            height: '800px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center p-4 border-b border-white/20`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex justify-center items-center w-8 h-8 rounded-full border backdrop-blur-sm bg-white/10 border-white/20">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white/80"
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
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.isUser ? 'order-2' : 'order-1'
                  }`}
                >
                  <div
                    className={`rounded-xl p-3 text-xs ${
                      message.isUser
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/10'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl border backdrop-blur-sm bg-white/10 border-white/20">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies - only show for initial message */}
            {messages.length === 1 &&
              quickReplies &&
              quickReplies.length > 0 && (
                <div className="mt-2 space-y-1">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/40 shadow-sm"
                      onClick={() => handleQuickReplyClick(reply.text)}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about AI transformation..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F45584] focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-[#F45584] to-[#E91E63] text-white p-2 rounded-lg hover:from-[#F45584]/90 hover:to-[#E91E63]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs text-white/50">Powered by Agelum AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Widget */}
      <div className="fixed right-4 bottom-4 z-40 lg:hidden">
        <div
          className={`flex flex-col w-80 h-96 rounded-2xl border shadow-xl backdrop-blur-xl bg-white/10 border-white/20`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center p-4 border-b border-white/20`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex justify-center items-center w-8 h-8 rounded-full border backdrop-blur-sm bg-white/10 border-white/20">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.isUser ? 'order-2' : 'order-1'
                  }`}
                >
                  <div
                    className={`rounded-xl p-3 text-xs ${
                      message.isUser
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/10'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl border backdrop-blur-sm bg-white/10 border-white/20">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies - only show for initial message */}
            {messages.length === 1 &&
              quickReplies &&
              quickReplies.length > 0 && (
                <div className="mt-2 space-y-1">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/40 shadow-sm"
                      onClick={() => handleQuickReplyClick(reply.text)}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about AI transformation..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F45584] focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-[#F45584] to-[#E91E63] text-white p-2 rounded-lg hover:from-[#F45584]/90 hover:to-[#E91E63]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs text-white/50">Powered by Agelum AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
