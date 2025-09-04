'use client'

import { siteColors } from '../colors'

interface Stat {
  value: string
  label: string
}

interface Testimonial {
  quote: string
  author: string
  company: string
}

interface SocialProofProps {
  title?: string
  sectionId?: string
  stats?: Stat[]
  testimonial?: Testimonial
}

export function SocialProof({
  title = 'Proven Results Across Industries',
  sectionId = 'social-proof',
  stats = [
    { value: '40%', label: 'Faster Project Delivery' },
    { value: '25%', label: 'Cost Reduction' },
    { value: '90%', label: 'Process Automation' },
    { value: '3x', label: 'ROI in First Year' },
  ],
  testimonial = {
    quote:
      "Agelum transformed our AI operations from reactive to predictive. We're now managing 50+ AI agents with 40% faster project delivery and 25% lower costs. The platform handles everything from agent deployment to performance monitoring.",
    author: 'Sarah Chen, CTO',
    company: 'TechCorp Industries',
  },
}: SocialProofProps) {
  return (
    <section id={sectionId} className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            {title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-5xl lg:text-6xl font-bold ${siteColors.text.pink} mb-2 drop-shadow-lg`}
                >
                  {item.value}
                </div>
                <div className={`${siteColors.text.gray300} text-lg`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${siteColors.backgrounds.glass} backdrop-blur-sm rounded-2xl p-8 border ${siteColors.borders.gray700} shadow-xl`}
          >
            <blockquote
              className={`text-xl ${siteColors.text.gray200} text-center italic mb-6`}
            >
              "{testimonial.quote}"
            </blockquote>
            <div className="text-center">
              <div className="text-white font-semibold">
                {testimonial.author}
              </div>
              <div className={`${siteColors.text.gray400}`}>
                {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
