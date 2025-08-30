'use client'

export function FeaturesSection() {
  const features = [
    {
      title: 'AI Agent Management',
      description:
        'Create, configure, and orchestrate AI agents at scale with intuitive tools and workflows.',
    },
    {
      title: 'Multi-Tenant Architecture',
      description:
        'Secure, isolated environments for each organization with enterprise-grade security.',
    },
    {
      title: 'Real-time Collaboration',
      description:
        'Teams can work together seamlessly with shared workspaces and real-time updates.',
    },
    {
      title: 'Advanced Analytics',
      description:
        'Comprehensive insights into agent performance, usage patterns, and ROI metrics.',
    },
    {
      title: 'Integration Hub',
      description:
        'Connect with existing tools and systems through our extensive API ecosystem.',
    },
    {
      title: 'Enterprise Security',
      description:
        'SOC 2 compliance, role-based access control, and audit logging for enterprise use.',
    },
  ]

  const featureIcons = ['🤖', '🏢', '👥', '📊', '🔗', '🔒']

  return (
    <section id="features" className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            Platform Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg text-2xl">
                  {featureIcons[index]}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
