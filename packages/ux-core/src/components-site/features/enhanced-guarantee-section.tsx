import React from 'react'
import { cn } from '../../utils/cn'
import { siteColors, siteUtils } from '../colors'

// Icons for guarantees
const GuaranteeIcons = {
  roi: (
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  timeline: (
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  support: (
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
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 1v6m0 4v6m6-12h-6m4 0h6M1 12h6m4 0h6"
      />
    </svg>
  ),
}

interface Guarantee {
  id: string
  title: string
  description: string
  icon: keyof typeof GuaranteeIcons
}

interface EnhancedGuaranteeSectionProps {
  title: string
  guarantees: Guarantee[]
  ctaText: string
  ctaSubtext: string
  onCtaClick?: () => void
  className?: string
}

export function EnhancedGuaranteeSection({
  title,
  guarantees,
  ctaText,
  ctaSubtext,
  onCtaClick,
  className,
}: EnhancedGuaranteeSectionProps) {
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
        </div>

        {/* Guarantee Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-8 text-center hover:border-[#F45584]/40 transition-all duration-300 hover:scale-105`}
            >
              {/* Guarantee Icon */}
              <div
                className={`inline-flex p-4 rounded-lg ${siteUtils.getGradientClasses(
                  'primary'
                )} text-white mb-6`}
              >
                {GuaranteeIcons[guarantee.icon]}
              </div>

              {/* Guarantee Content */}
              <h3 className={`text-xl font-bold ${siteColors.text.white} mb-4`}>
                {guarantee.title}
              </h3>
              <p className={`${siteColors.text.gray300} leading-relaxed`}>
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final Call to Action */}
        <div
          className={`${siteColors.backgrounds.glass} border ${siteColors.borders.white20} rounded-xl p-12 text-center`}
        >
          <div className="max-w-3xl mx-auto">
            <button
              onClick={onCtaClick}
              className={`px-12 py-6 rounded-xl font-bold text-xl transition-all duration-300 ${siteUtils.getButtonClasses(
                'primary'
              )} hover:scale-105 hover:shadow-lg mb-6`}
            >
              {ctaText}
            </button>
            <p className={`text-lg ${siteColors.text.gray300} leading-relaxed`}>
              {ctaSubtext}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
