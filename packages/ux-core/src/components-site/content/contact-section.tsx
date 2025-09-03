'use client'

interface ContactCard {
  title: string
  description: string
  buttonText: string
  buttonColor?: 'pink' | 'purple'
  onButtonClick?: () => void
}

interface ContactSectionProps {
  title?: string
  subtitle?: string
  sectionId?: string
  cards?: ContactCard[]
}

export function ContactSection({
  title = 'Ready to Transform Your Business?',
  subtitle = 'Join the AI revolution and start seeing results in 90 days or less',
  sectionId = 'contact',
  cards = [
    {
      title: 'Get Free Analysis',
      description:
        'Our AI experts will analyze your business and provide a customized implementation plan.',
      buttonText: 'Start Free Analysis',
      buttonColor: 'pink',
    },
    {
      title: 'Schedule Demo',
      description:
        'See TeamHub in action with a personalized demo of our platform capabilities.',
      buttonText: 'Book Demo',
      buttonColor: 'purple',
    },
  ],
}: ContactSectionProps) {
  return (
    <section id={sectionId} className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            {title}
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-300 mb-6">{card.description}</p>
                <button
                  className={`font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ${
                    card.buttonColor === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-pink-500 hover:bg-pink-600'
                  } text-white`}
                  onClick={card.onButtonClick}
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
