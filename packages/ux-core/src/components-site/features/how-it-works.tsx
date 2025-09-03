'use client'

import { siteColors } from '../colors'

interface Step {
  title: string
  description: string
}

interface HowItWorksProps {
  title?: string
  subtitle?: string
  sectionId?: string
  steps?: Step[]
  className?: string
}

export function HowItWorks({
  title = 'How TeamHub Works',
  subtitle = 'Get started with AI agents in three simple steps',
  sectionId = 'how-it-works',
  steps = [
    {
      title: 'Connect & Configure',
      description:
        'Connect your data sources and configure your AI agents with our intuitive interface.',
    },
    {
      title: 'Deploy & Monitor',
      description:
        'Deploy agents across your organization and monitor their performance in real-time.',
    },
    {
      title: 'Scale & Optimize',
      description:
        'Scale your AI operations and continuously optimize performance based on insights.',
    },
  ],
  className = 'py-20 px-6 lg:px-12 bg-gray-900/30',
}: HowItWorksProps) {
  return (
    <section id={sectionId} className={className}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            {title}
          </h2>
          <p
            className={`text-xl ${siteColors.text.gray300} mb-12 max-w-3xl mx-auto`}
          >
            {subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div
                key={index}
                className={`${siteColors.backgrounds.glass} backdrop-blur-sm rounded-2xl p-8 border ${siteColors.borders.gray700} shadow-xl`}
              >
                <div
                  className={`w-16 h-16 ${siteColors.gradients.primary} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-2xl">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <p className={`${siteColors.text.gray300}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
