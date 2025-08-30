'use client'

export function SocialProofSection() {
  const stats = [
    { value: '40%', label: 'Faster Project Delivery' },
    { value: '25%', label: 'Cost Reduction' },
    { value: '90%', label: 'Process Automation' },
    { value: '3x', label: 'ROI in First Year' },
  ]

  return (
    <section id="social-proof" className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            Proven Results Across Industries
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-pink-500 mb-2 drop-shadow-lg">
                  {item.value}
                </div>
                <div className="text-gray-300 text-lg">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <blockquote className="text-xl text-gray-200 text-center italic mb-6">
              "TeamHub transformed our AI operations from reactive to
              predictive. We're now managing 50+ AI agents with 40% faster
              project delivery and 25% lower costs. The platform handles
              everything from agent deployment to performance monitoring."
            </blockquote>
            <div className="text-center">
              <div className="text-white font-semibold">Sarah Chen, CTO</div>
              <div className="text-gray-400">TechCorp Industries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
