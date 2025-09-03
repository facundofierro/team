'use client'

import { siteColors, siteUtils } from '../colors'

interface LandingHeroProps {
  title?: string
  subtitle?: string
  ctaSection?: {
    title: string
    description: string
    buttonText: string
    onButtonClick?: () => void
  }
  enhancedSubsections?: Array<{
    icon: string
    title: string
    description: string
  }>
  limitedTimeCallout?: {
    title: string
    description: string
    buttonText: string
    trustIndicators: string[]
    onButtonClick?: () => void
  }
}

export function LandingHero({
  title = 'AI Is No Longer Optional For Success',
  subtitle = "The competitive landscape has shifted. Smart businesses are leveraging AI to cut costs by 25%, deliver projects 40% faster, and scale without limits. The question isn't whether to adopt AI —it's how quickly you can implement it.",
  ctaSection = {
    title: 'The Opportunity Window Is Narrowing',
    description:
      'Industry leaders have already gained significant advantages through AI implementation. The gap between AI-enabled and traditional businesses grows wider each month, making early adoption crucial for maintaining competitive position.',
    buttonText: 'Get Free AI Analysis Now',
  },
  enhancedSubsections = [],
  limitedTimeCallout,
}: LandingHeroProps) {
  return (
    <section className="relative py-32 sm:py-40 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-8">
          <span
            className={`text-transparent bg-clip-text ${siteColors.gradients.primary}`}
          >
            {title}
          </span>
        </h1>
        <p
          className={`text-xl sm:text-2xl ${siteColors.text.gray300} mb-12 max-w-4xl mx-auto leading-relaxed`}
        >
          {subtitle}
        </p>

        {/* CTA Section */}
        <div
          className={`mt-12 bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-2xl p-8 border ${siteColors.borders.gray700} shadow-xl max-w-4xl mx-auto`}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {ctaSection.title}
          </h3>
          <p className={`${siteColors.text.gray200} mb-6 text-lg`}>
            {ctaSection.description}
          </p>
          <button
            className={`text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl ${siteUtils.getButtonClasses(
              'cta'
            )}`}
            onClick={ctaSection.onButtonClick}
          >
            {ctaSection.buttonText}
          </button>
        </div>

        {/* Enhanced Subsections */}
        {enhancedSubsections.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {enhancedSubsections.map((subsection, index) => (
              <div
                key={index}
                className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border ${siteColors.borders.gray700} shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-800/80`}
              >
                <div className="text-3xl mb-3">{subsection.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {subsection.title}
                </h4>
                <p className={`${siteColors.text.gray300} text-sm`}>
                  {subsection.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Limited Time Callout */}
        {limitedTimeCallout && (
          <div
            className={`mt-16 bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border ${siteColors.borders.pink500} shadow-xl max-w-4xl mx-auto`}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {limitedTimeCallout.title}
            </h3>
            <p className={`${siteColors.text.gray200} mb-6 text-lg`}>
              {limitedTimeCallout.description}
            </p>
            <button
              className={`text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl ${siteUtils.getButtonClasses(
                'cta'
              )} mb-6`}
              onClick={limitedTimeCallout.onButtonClick}
            >
              {limitedTimeCallout.buttonText}
            </button>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {limitedTimeCallout.trustIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${siteColors.text.gray300}`}
                >
                  <svg
                    className="w-4 h-4 text-green-400"
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
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
