'use client'

interface ValueCardProps {
  title: string
  description: string
  features: string[]
}

function ValueCard({ title, description, features }: ValueCardProps) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
      <h3 className="text-2xl font-semibold text-pink-500 mb-4">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface ProblemSectionProps {
  title?: string
  sectionId?: string
  valueCards?: Array<{
    title: string
    description: string
    features: string[]
  }>
}

export function ProblemSection({
  title = 'AI Implementation Is No Longer Optional',
  sectionId = 'problem',
  valueCards = [
    {
      title: 'The Competitive Reality',
      description:
        'Industry leaders are gaining 15-30% operational advantages with AI',
      features: [
        'Industry leaders are gaining 15-30% operational advantages with AI',
        'Market demands are shifting toward AI-enabled organizations',
        'Top talent increasingly chooses AI-forward companies',
      ],
    },
    {
      title: 'The AI Advantage',
      description: 'Transform your business with intelligent automation',
      features: [
        '40% reduction in project delivery time',
        '25% cost savings through intelligent automation',
        'Real-time insights for better decision making',
      ],
    },
  ],
}: ProblemSectionProps) {
  return (
    <section id={sectionId} className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
            {title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {valueCards.map((card, index) => (
              <ValueCard
                key={index}
                title={card.title}
                description={card.description}
                features={card.features}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
