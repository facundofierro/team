'use client'

import { siteColors, siteUtils } from '../colors'

interface Feature {
  title: string
  description: string
  icon?: string
}

interface LandingFeaturesProps {
  title?: string
  features?: Feature[]
  sectionId?: string
}

export function LandingFeatures({
  title = 'Platform Capabilities',
  features = [
    {
      title: 'AI Agent Management',
      description:
        'Create, configure, and orchestrate AI agents at scale with intuitive tools and workflows.',
      icon: '🤖',
    },
    {
      title: 'Multi-Tenant Architecture',
      description:
        'Secure, isolated environments for each organization with enterprise-grade security.',
      icon: '🏢',
    },
    {
      title: 'Real-time Collaboration',
      description:
        'Teams can work together seamlessly with shared workspaces and real-time updates.',
      icon: '👥',
    },
    {
      title: 'Advanced Analytics',
      description:
        'Comprehensive insights into agent performance, usage patterns, and ROI metrics.',
      icon: '📊',
    },
    {
      title: 'Integration Hub',
      description:
        'Connect with existing tools and systems through our extensive API ecosystem.',
      icon: '🔗',
    },
    {
      title: 'Enterprise Security',
      description:
        'SOC 2 compliance, role-based access control, and audit logging for enterprise use.',
      icon: '🔒',
    },
  ],
  sectionId = 'features',
}: LandingFeaturesProps) {
  return (
    <section id={sectionId} className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            {title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${siteColors.backgrounds.glass} backdrop-blur-sm rounded-2xl p-8 border ${siteColors.borders.gray700} shadow-xl hover:shadow-2xl transition-all`}
              >
                <div
                  className={`w-16 h-16 ${siteColors.gradients.primary} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg text-2xl`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className={`${siteColors.text.gray300}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
