import React, { useState } from 'react'
import {
  FeatureGrid,
  FeatureGridItem,
  ValuePropositionCard,
  IndustryTabSelector,
} from './index'

export function FeatureExample() {
  const [selectedIndustry, setSelectedIndustry] = useState('construction')

  const industries = [
    {
      id: 'construction',
      name: 'Construction Company',
      color: '#F45584',
      features: [
        'Real-time price monitoring',
        'Bulk order optimization',
        'Weather impact prediction',
        'Resource conflict resolution',
        'Critical path optimization',
      ],
      description: 'AI-powered construction management and optimization',
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing Business',
      color: '#8A548C',
      features: [
        'Predictive maintenance',
        'Quality control automation',
        'Supply chain optimization',
        'Production scheduling',
        'Inventory management',
      ],
      description: 'Smart manufacturing with AI-driven insights',
    },
    {
      id: 'logistics',
      name: 'Logistics & Transport',
      color: '#A091DA',
      features: [
        'Route optimization',
        'Fleet management',
        'Delivery tracking',
        'Fuel efficiency',
        'Real-time monitoring',
      ],
      description: 'Intelligent logistics and transportation solutions',
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      color: '#E6D24D',
      features: [
        'Customer behavior analysis',
        'Inventory forecasting',
        'Dynamic pricing',
        'Personalized recommendations',
        'Demand prediction',
      ],
      description: 'Data-driven retail and e-commerce optimization',
    },
  ]

  const aiSolutions = [
    {
      icon: (
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
      title: 'Quality Control Automation',
      metric: '60% fewer defects',
      metricColor: 'teamhub-success' as const,
      description:
        'AI-powered inspections and compliance monitoring reduce errors.',
      features: [
        'Automated safety inspections',
        'Code compliance checking',
        'Progress photo analysis',
      ],
    },
    {
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      title: 'Workforce Planning',
      metric: '30% efficiency gain',
      metricColor: 'teamhub-accent' as const,
      description:
        'Intelligent scheduling and skill matching for optimal team deployment.',
      features: [
        'Skill-based assignments',
        'Overtime optimization',
        'Training need identification',
      ],
    },
    {
      icon: (
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
      title: 'Cost Analysis & Reporting',
      metric: 'Live ROI tracking',
      metricColor: 'teamhub-highlight' as const,
      description:
        'Real-time project profitability tracking and predictive cost modeling.',
      features: [
        'Profit margin monitoring',
        'Cost overrun prediction',
        'Client billing automation',
      ],
    },
    {
      icon: (
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
      ),
      title: 'Client Communication',
      metric: '50% time savings',
      metricColor: 'teamhub-success' as const,
      description:
        'Automated progress updates and intelligent client query handling.',
      features: [
        'Progress report generation',
        'Client portal updates',
        'Issue escalation alerts',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-teamhub-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Industry Selection Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teamhub-secondary mb-4">
              Select Your Industry
            </h2>
            <p className="text-lg text-teamhub-muted max-w-2xl mx-auto">
              Discover how AI solutions can transform your specific industry
              with tailored features and capabilities.
            </p>
          </div>

          <IndustryTabSelector
            tabs={industries.map((industry) => ({
              id: industry.id,
              name: industry.name,
              icon: (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: industry.color }}
                />
              ),
              description: industry.description,
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {industry.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-teamhub-highlight rounded-full"></div>
                        <span className="text-teamhub-secondary">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-teamhub-muted">{industry.description}</p>
                </div>
              ),
            }))}
            defaultTab={selectedIndustry}
            onTabChange={setSelectedIndustry}
          />
        </div>

        {/* AI Solutions Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teamhub-secondary mb-4">
              AI Solutions That Drive Results
            </h2>
            <p className="text-lg text-teamhub-muted max-w-3xl mx-auto">
              Every automation you see can be customized for your specific
              industry, processes, and goals.
            </p>
          </div>

          <FeatureGrid cols={2} gap="lg">
            {aiSolutions.map((solution, index) => (
              <FeatureGridItem key={index}>
                <ValuePropositionCard
                  icon={solution.icon}
                  title={solution.title}
                  metric={{
                    value: solution.metric,
                    label: '',
                    color: solution.metricColor,
                  }}
                  description={solution.description}
                  features={solution.features}
                  variant="elevated"
                  size="lg"
                />
              </FeatureGridItem>
            ))}
          </FeatureGrid>
        </div>

        {/* Why These Work Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-teamhub-secondary mb-6">
            Why These Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              'Industry-specific training',
              'Custom integration',
              'Proven methodologies',
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5 text-teamhub-success"
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
                <span className="text-teamhub-secondary font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for Implementation Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teamhub-primary to-teamhub-accent text-white px-6 py-3 rounded-full">
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
            <span className="font-semibold">Ready for Implementation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
