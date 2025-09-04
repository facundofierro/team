import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { siteColors, siteUtils } from '../colors'

// Icons for phases and milestones
const PhaseIcons = {
  discovery: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  design: (
    <svg
      className="w-8 h-8"
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
  ),
  deployment: (
    <svg
      className="w-8 h-8"
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
  ),
  scale: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
      />
    </svg>
  ),
}

const TrustIcons = {
  downtime: (
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
  roi: (
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  support: (
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
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 1v6m0 4v6m6-12h-6m4 0h6M1 12h6m4 0h6"
      />
    </svg>
  ),
}

const DeliverableIcons = {
  audit: (
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
  assessment: (
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
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  roadmap: (
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
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  development: (
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
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
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
  monitoring: (
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
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  optimization: (
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
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
}

interface PhaseDeliverable {
  title: string
  icon: keyof typeof DeliverableIcons
}

interface Phase {
  id: string
  title: string
  subtitle: string
  duration: string
  description: string
  deliverables: PhaseDeliverable[]
  icon: keyof typeof PhaseIcons
}

interface Milestone {
  day: number
  title: string
  description: string
}

interface ImplementationTimelineSectionProps {
  title: string
  subtitle: string
  phases: Phase[]
  milestones: Milestone[]
  trustElements: {
    title: string
    description: string
    icon: keyof typeof TrustIcons
  }[]
  ctaText: string
  onCtaClick?: () => void
  className?: string
}

export function ImplementationTimelineSection({
  title,
  subtitle,
  phases,
  milestones,
  trustElements,
  ctaText,
  onCtaClick,
  className,
}: ImplementationTimelineSectionProps) {
  const [selectedPhase, setSelectedPhase] = useState(phases[0]?.id || '')

  const currentPhase = phases.find((phase) => phase.id === selectedPhase)

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

          {/* Trust Elements */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
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

        {/* Phase Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={cn(
                'text-left p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105',
                selectedPhase === phase.id
                  ? `border-[#F45584] ${siteColors.backgrounds.glassLight} shadow-lg`
                  : `${siteColors.borders.white20} hover:border-[#F45584]/40 ${siteColors.backgrounds.glass}`
              )}
            >
              {/* Phase Icon */}
              <div
                className={`inline-flex p-3 rounded-lg ${siteUtils.getGradientClasses(
                  'primary'
                )} text-white mb-4`}
              >
                {PhaseIcons[phase.icon]}
              </div>

              {/* Phase Info */}
              <div className="mb-3">
                <div
                  className={`text-sm font-medium ${siteColors.text.pink} mb-1`}
                >
                  Phase {index + 1}
                </div>
                <div className={`text-sm ${siteColors.text.gray400} mb-2`}>
                  {phase.duration}
                </div>
              </div>

              <h3
                className={`text-lg font-semibold ${siteColors.text.white} mb-2`}
              >
                {phase.title}
              </h3>
              <p
                className={`text-sm ${siteColors.text.gray300} leading-relaxed`}
              >
                {phase.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Phase Details */}
        {currentPhase && (
          <div
            className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-8 mb-16`}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Phase Description */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`p-4 rounded-lg ${siteUtils.getGradientClasses(
                      'primary'
                    )} text-white`}
                  >
                    {PhaseIcons[currentPhase.icon]}
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold ${siteColors.text.white}`}
                    >
                      {currentPhase.title}
                    </h3>
                    <p className={`${siteColors.text.gray400}`}>
                      {currentPhase.duration}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-lg ${siteColors.text.gray300} leading-relaxed`}
                >
                  {currentPhase.description}
                </p>
              </div>

              {/* Deliverables */}
              <div>
                <h4
                  className={`text-xl font-semibold ${siteColors.text.white} mb-6`}
                >
                  Key Deliverables
                </h4>
                <div className="space-y-4">
                  {currentPhase.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${siteColors.backgrounds.glassLight}`}
                      >
                        <span className={siteColors.text.pink}>
                          {DeliverableIcons[deliverable.icon]}
                        </span>
                      </div>
                      <span
                        className={`${siteColors.text.gray300} font-medium`}
                      >
                        {deliverable.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 90-Day Timeline Milestones */}
        <div className="mb-16">
          <h3
            className={`text-2xl font-bold ${siteColors.text.white} text-center mb-12`}
          >
            90-Day Timeline
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-6 text-center`}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${siteUtils.getGradientClasses(
                    'primary'
                  )} text-white text-2xl font-bold mb-4`}
                >
                  {milestone.day}
                </div>
                <h4
                  className={`text-lg font-semibold ${siteColors.text.white} mb-2`}
                >
                  {milestone.title}
                </h4>
                <p
                  className={`text-sm ${siteColors.text.gray300} leading-relaxed`}
                >
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ready to Start CTA */}
        <div
          className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-8 text-center`}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div
              className={`p-3 rounded-lg ${siteUtils.getGradientClasses(
                'primary'
              )} text-white`}
            >
              <svg
                className="w-8 h-8"
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
            <h4 className={`text-2xl font-bold ${siteColors.text.white}`}>
              Ready to Start?
            </h4>
          </div>
          <p
            className={`text-lg ${siteColors.text.gray300} mb-8 max-w-2xl mx-auto`}
          >
            Book your free consultation and get your personalized 90-day
            roadmap.
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
