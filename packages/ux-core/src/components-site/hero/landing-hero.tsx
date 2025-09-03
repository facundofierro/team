'use client'

interface LandingHeroProps {
  title?: string
  subtitle?: string
  ctaSection?: {
    title: string
    description: string
    buttonText: string
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
}: LandingHeroProps) {
  return (
    <section className="relative py-32 sm:py-40 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            {title}
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            {ctaSection.title}
          </h3>
          <p className="text-gray-200 mb-6 text-lg">{ctaSection.description}</p>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            onClick={ctaSection.onButtonClick}
          >
            {ctaSection.buttonText}
          </button>
        </div>
      </div>
    </section>
  )
}
