import React, { useState } from 'react'
import {
  ChatWidget,
  MessageBubble,
  BotAvatar,
  UserAvatar,
  QuickReplies,
} from './index'

export function AIWidgetExample() {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      type: 'bot' | 'user'
      message: string
      timestamp: string
    }>
  >([
    {
      id: '1',
      type: 'bot' as const,
      message:
        "Hi! I'm your AI business transformation consultant. I can help you understand how Agelum can revolutionize your operations and deliver guaranteed ROI. What would you like to explore first?",
      timestamp: '2:30 PM',
    },
  ])

  const quickReplies = [
    {
      id: 'analyze',
      text: 'Analyze My Business',
      variant: 'primary' as const,
      onClick: () => handleQuickReply('analyze'),
    },
    {
      id: 'examples',
      text: 'Show Me Examples',
      variant: 'secondary' as const,
      onClick: () => handleQuickReply('examples'),
    },
    {
      id: 'savings',
      text: 'Calculate My Savings',
      variant: 'secondary' as const,
      onClick: () => handleQuickReply('savings'),
    },
    {
      id: 'how-it-works',
      text: 'How It Works',
      variant: 'secondary' as const,
      onClick: () => handleQuickReply('how-it-works'),
    },
  ]

  const handleQuickReply = (action: string) => {
    let response = ''

    switch (action) {
      case 'analyze':
        response =
          "Great! I'd love to analyze your business. To get started, I'll need to understand your current operations, challenges, and goals. What industry are you in, and what specific areas would you like to improve?"
        break
      case 'examples':
        response =
          "Perfect! Let me show you some real examples of how Agelum has transformed businesses. We've helped companies achieve 40% faster project delivery, 25% cost reduction, and 90% process automation. Which industry examples would be most relevant to you?"
        break
      case 'savings':
        response =
          'Excellent question! Our clients typically see ROI within 3-6 months. Based on industry benchmarks, you could expect 25-40% cost savings, 30-50% time savings, and significant efficiency gains. Would you like me to create a custom savings estimate for your business?'
        break
      case 'how-it-works':
        response =
          'Agelum works in three phases: 1) AI Agent Setup - We configure AI agents for your specific needs, 2) Integration - Seamlessly connect with your existing systems, 3) Optimization - Continuous improvement and scaling. The entire process takes just 90 days from start to finish!'
        break
      default:
        response =
          "I'm here to help! What specific aspect of AI transformation would you like to explore?"
    }

    const newMessage = {
      id: Date.now().toString(),
      type: 'bot' as const,
      message: response,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        message:
          "Thank you for your message! I'm processing your request and will provide a detailed response shortly. Is there anything specific about AI transformation you'd like me to focus on?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-teamhub-background">
      {/* Main Content */}
      <div className="pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-teamhub-secondary mb-6">
            AI Widget Components Demo
          </h1>
          <p className="text-lg text-teamhub-muted mb-12">
            Interactive AI chat interface components for your landing page
          </p>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget
        title="AI Business Consultant"
        subtitle="Online • Ready to help"
        position="left"
        size="md"
        onSendMessage={handleSendMessage}
        footerText="Powered by Agelum AI"
      >
        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              type={msg.type}
              timestamp={msg.timestamp}
              avatar={
                msg.type === 'bot' ? (
                  <BotAvatar size="sm" status="online" />
                ) : (
                  <UserAvatar size="sm" initials="U" />
                )
              }
              showAvatar
              showTimestamp
            />
          ))}
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="mt-6">
            <QuickReplies replies={quickReplies} layout="vertical" size="md" />
          </div>
        )}
      </ChatWidget>

      {/* Alternative Chat Widget (Right Side) */}
      <ChatWidget
        title="AI Support Assistant"
        subtitle="Online • Available 24/7"
        position="right"
        size="sm"
        onSendMessage={handleSendMessage}
        footerText="Agelum Support"
      >
        <MessageBubble
          message="Hello! I'm here to help with any questions about Agelum. How can I assist you today?"
          type="bot"
          avatar={<BotAvatar size="sm" status="online" />}
          showAvatar
        />
        <QuickReplies
          replies={[
            {
              id: 'help',
              text: 'Get Help',
              variant: 'primary',
              onClick: () => console.log('Get Help clicked'),
            },
            {
              id: 'docs',
              text: 'Documentation',
              variant: 'secondary',
              onClick: () => console.log('Documentation clicked'),
            },
          ]}
          layout="vertical"
          size="sm"
        />
      </ChatWidget>

      {/* Bottom Right Chat Widget */}
      <ChatWidget
        title="Quick Chat"
        subtitle="Online • Quick questions"
        position="bottom-right"
        size="sm"
        onSendMessage={handleSendMessage}
        showFooter={false}
      >
        <MessageBubble
          message="Need a quick answer? I'm here to help!"
          type="bot"
          avatar={<BotAvatar size="sm" status="online" />}
          showAvatar
        />
        <QuickReplies
          replies={[
            {
              id: 'quick',
              text: 'Quick Question',
              variant: 'outline',
              onClick: () => console.log('Quick Question clicked'),
            },
          ]}
          layout="horizontal"
          size="sm"
        />
      </ChatWidget>
    </div>
  )
}
