'use client'

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

// Import content and handlers
import {
  heroContent,
  headerContent,
  featuresContent,
  problemContent,
  solutionContent,
  howItWorksContent,
  socialProofContent,
  contactContent,
  chatWidgetContent,
} from '@/content'

import {
  navigationHandlers,
  interactionHandlers,
  formHandlers,
} from '@/handlers'

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <LandingHeader
        logo={headerContent.logo}
        navigation={headerContent.navigation}
        ctaButton={{
          ...headerContent.ctaButton,
          onClick: navigationHandlers.onGetStartedClick,
        }}
        languages={headerContent.languages}
        currentLanguage={headerContent.languages[0]} // Default to first language
        onLanguageChange={navigationHandlers.onLanguageChange}
      />

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        {/* Floating AI Chat Widget */}
        <AIChatWidget
          title={chatWidgetContent.title}
          subtitle={chatWidgetContent.subtitle}
          initialMessage={chatWidgetContent.initialMessage}
          quickReplies={chatWidgetContent.quickReplies}
          onQuickReplyClick={interactionHandlers.onChatQuickReplyClick}
          onMinimize={interactionHandlers.onChatMinimize}
          onExpand={interactionHandlers.onChatExpand}
        />

        {/* Page Sections */}
        <LandingHeroSection
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          ctaSection={{
            ...heroContent.ctaSection,
            onButtonClick: interactionHandlers.onHeroCtaClick,
          }}
        />

        <ProblemSection
          title={problemContent.title}
          sectionId={problemContent.sectionId}
          valueCards={problemContent.valueCards}
        />

        <SolutionSection
          title={solutionContent.title}
          subtitle={solutionContent.subtitle}
          sectionId={solutionContent.sectionId}
          solutionCards={solutionContent.solutionCards}
        />

        <FeaturesSection
          title={featuresContent.title}
          features={featuresContent.features}
          sectionId={featuresContent.sectionId}
        />

        <SocialProofSection
          title={socialProofContent.title}
          sectionId={socialProofContent.sectionId}
          stats={socialProofContent.stats}
          testimonial={socialProofContent.testimonial}
        />

        <HowItWorksSection
          title={howItWorksContent.title}
          subtitle={howItWorksContent.subtitle}
          sectionId={howItWorksContent.sectionId}
          steps={howItWorksContent.steps}
        />

        <ContactSection
          title={contactContent.title}
          subtitle={contactContent.subtitle}
          sectionId={contactContent.sectionId}
          cards={contactContent.cards.map((card) => ({
            ...card,
            onButtonClick:
              card.buttonText === 'Start Free Analysis'
                ? formHandlers.onStartFreeAnalysisClick
                : formHandlers.onBookDemoClick,
          }))}
        />
      </div>
    </div>
  )
}
