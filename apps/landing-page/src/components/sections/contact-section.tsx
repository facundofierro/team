'use client'

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join the AI revolution and start seeing results in 90 days or less
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Get Free Analysis
              </h3>
              <p className="text-gray-300 mb-6">
                Our AI experts will analyze your business and provide a
                customized implementation plan.
              </p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                Start Free Analysis
              </button>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Schedule Demo
              </h3>
              <p className="text-gray-300 mb-6">
                See TeamHub in action with a personalized demo of our platform
                capabilities.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
