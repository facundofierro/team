'use client'

export function HowItWorksSection() {
  const steps = [
    {
      title: 'Connect & Configure',
      description:
        'Connect your data sources and configure your AI agents with our intuitive interface.',
    },
    {
      title: 'Deploy & Monitor',
      description:
        'Deploy agents across your organization and monitor their performance in real-time.',
    },
    {
      title: 'Scale & Optimize',
      description:
        'Scale your AI operations and continuously optimize performance based on insights.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            How TeamHub Works
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Get started with AI agents in three simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {index + 1}
                  </span>
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
