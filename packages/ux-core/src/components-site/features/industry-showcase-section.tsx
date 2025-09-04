import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { siteColors, siteUtils } from '../colors'

// Icons for automation categories
const AutomationIcons = {
  procurement: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  timeline: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  quality: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  workforce: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  analytics: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  communication: (
    <svg
      className="w-6 h-6"
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
  ),
}

// Trust building icons
const TrustIcons = {
  training: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  integration: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  methodology: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  ),
}

interface AutomationFeature {
  id: string
  title: string
  metric: string
  description: string
  benefits: string[]
  icon: keyof typeof AutomationIcons
}

interface Industry {
  id: string
  name: string
  description: string
  automations: AutomationFeature[]
}

interface IndustryShowcaseSectionProps {
  title: string
  subtitle: string
  industries: Industry[]
  trustElements: {
    title: string
    description: string
    icon: keyof typeof TrustIcons
  }[]
  ctaText: string
  onCtaClick?: () => void
  className?: string
}

export function IndustryShowcaseSection({
  title,
  subtitle,
  industries,
  trustElements,
  ctaText,
  onCtaClick,
  className,
}: IndustryShowcaseSectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(
    industries[0]?.id || ''
  )

  const currentIndustry = industries.find(
    (industry) => industry.id === selectedIndustry
  )

  return (
    <section className={cn('py-20', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold ${siteColors.text.white} mb-6`}
          >
            {title}
          </h2>
          <p
            className={`text-xl ${siteColors.text.gray300} max-w-3xl mx-auto leading-relaxed`}
          >
            {subtitle}
          </p>
        </div>

        {/* Industry Selection */}
        <div className="mb-12">
          <h3
            className={`text-2xl font-bold ${siteColors.text.white} text-center mb-8`}
          >
            Select Your Industry
          </h3>

          {/* Industry Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                  selectedIndustry === industry.id
                    ? `border-[#F45584] ${siteColors.backgrounds.glassLight} ${siteColors.text.white}`
                    : `${siteColors.borders.white20} hover:border-[#F45584]/40 ${siteColors.text.gray300} hover:bg-white/5`
                )}
              >
                <span className="font-semibold text-sm md:text-base">
                  {industry.name}
                </span>
              </button>
            ))}
          </div>

          {/* Why These Work */}
          <div className="max-w-2xl mx-auto">
            <h4
              className={`text-lg font-semibold ${siteColors.text.white} text-center mb-6`}
            >
              Why These Work
            </h4>
            <div className="grid grid-cols-3 gap-6">
              {trustElements.map((element, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`p-3 rounded-lg ${siteColors.backgrounds.glassLight} mb-3`}
                  >
                    <span className={siteColors.text.white}>
                      {TrustIcons[element.icon]}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${siteColors.text.gray300} font-medium`}
                  >
                    {element.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Automations Display */}
        {currentIndustry && (
          <div className="space-y-8">
            {/* Industry Header */}
            <div className="text-center">
              <h3
                className={`text-3xl font-bold ${siteColors.text.white} mb-4`}
              >
                {currentIndustry.name} AI Automations
              </h3>
              <p
                className={`text-lg ${siteColors.text.gray300} max-w-2xl mx-auto`}
              >
                {currentIndustry.description}
              </p>
            </div>

            {/* Automation Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentIndustry.automations.map((automation) => (
                <div
                  key={automation.id}
                  className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-6 hover:border-[#F45584]/40 transition-all duration-300`}
                >
                  {/* Automation Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div
                      className={`p-3 rounded-lg ${siteUtils.getGradientClasses(
                        'primary'
                      )} text-white flex-shrink-0`}
                    >
                      {AutomationIcons[automation.icon]}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-lg font-semibold ${siteColors.text.white} mb-1`}
                      >
                        {automation.title}
                      </h4>
                      <span
                        className={`text-sm font-medium ${siteColors.text.pink}`}
                      >
                        {automation.metric}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className={`${siteColors.text.gray300} text-sm mb-4 leading-relaxed`}
                  >
                    {automation.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {automation.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg
                          className={`w-4 h-4 ${siteColors.text.pink} flex-shrink-0`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className={`text-sm ${siteColors.text.gray300}`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Ready for Implementation */}
            <div
              className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-8 text-center`}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${siteUtils.getGradientClasses(
                    'primary'
                  )} text-white`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span
                  className={`text-lg font-semibold ${siteColors.text.white}`}
                >
                  Ready for Implementation
                </span>
              </div>
              <p
                className={`${siteColors.text.gray300} mb-6 max-w-2xl mx-auto`}
              >
                These automations can be deployed in your business within 90
                days. Each solution is customized to your specific processes and
                integrated with your existing systems.
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className={`text-2xl font-bold ${siteColors.text.white} mb-4`}>
            This Could Be Your Business Tomorrow
          </h3>
          <p
            className={`text-lg ${siteColors.text.gray300} mb-8 max-w-2xl mx-auto`}
          >
            Every automation you just saw can be customized for your specific
            industry, processes, and goals. Start with a free analysis to see
            exactly how AI agents will transform your operations.
          </p>
          <button
            onClick={onCtaClick}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${siteUtils.getButtonClasses(
              'primary'
            )} hover:scale-105 hover:shadow-lg`}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  )
}
