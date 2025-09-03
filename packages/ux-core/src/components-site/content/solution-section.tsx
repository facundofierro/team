'use client'

interface SolutionCard {
  title: string
  description: string
  icon?: string
}

interface SolutionSectionProps {
  title?: string
  subtitle?: string
  sectionId?: string
  solutionCards?: SolutionCard[]
  className?: string
}

export function SolutionSection({
  title = 'The TeamHub Guarantee',
  subtitle = "We don't just implement AI - we transform your entire operation into an intelligent, self-optimizing system that delivers measurable ROI from day one.",
  sectionId = 'solution',
  solutionCards = [
    {
      title: '90-Day Implementation',
      description: 'From zero to fully operational AI agents',
      icon: '🚀',
    },
    {
      title: 'Guaranteed ROI',
      description: 'Minimum 3x return on investment or money back',
      icon: '💰',
    },
    {
      title: 'Zero Risk Start',
      description: 'Free analysis and proof of concept',
      icon: '🛡️',
    },
  ],
  className = 'py-20 px-6 lg:px-12 bg-gray-900/30',
}: SolutionSectionProps) {
  return (
    <section id={sectionId} className={className}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            {title}
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {solutionCards.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg text-2xl">
                  {item.icon ||
                    (index === 0 ? '🚀' : index === 1 ? '💰' : '🛡️')}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
