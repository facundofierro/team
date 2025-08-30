import {
  LandingHeader,
  AIChatWidget,
  LandingHeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  SocialProofSection,
  HowItWorksSection,
  ContactSection,
} from '@/components'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-sans">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        {/* Floating AI Chat Widget */}
        <AIChatWidget />

        {/* Page Sections */}
        <LandingHeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <SocialProofSection />
        <HowItWorksSection />
        <ContactSection />
      </div>
    </div>
  )
}
