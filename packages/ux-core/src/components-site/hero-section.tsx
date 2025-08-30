import React from 'react'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
}

export function HeroSection({
  title,
  subtitle,
  ctaText = 'Get Started',
  onCtaClick,
}: HeroSectionProps) {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {onCtaClick && (
          <button
            onClick={onCtaClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {ctaText}
          </button>
        )}
      </div>
    </section>
  )
}
