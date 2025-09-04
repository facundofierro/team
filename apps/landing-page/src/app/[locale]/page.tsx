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
  IndustryShowcaseSection,
  ImplementationTimelineSection,
  EnhancedGuaranteeSection,
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
  industryShowcaseContent,
  implementationTimelineContent,
  enhancedGuaranteeContent,
} from '@/content'

import {
  navigationHandlers,
  interactionHandlers,
  formHandlers,
} from '@/handlers'

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header - Full width background but content with left offset */}
      <div className="relative">
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
      </div>

      {/* Main Content - Left space for chat widget */}
      <div className="pt-16 min-h-screen">
        {/* AI Chat Widget - Responsive positioning */}
        <AIChatWidget
          title={chatWidgetContent.title}
          subtitle={chatWidgetContent.subtitle}
          initialMessage={chatWidgetContent.initialMessage}
          quickReplies={chatWidgetContent.quickReplies}
          onQuickReplyClick={interactionHandlers.onChatQuickReplyClick}
          onMinimize={interactionHandlers.onChatMinimize}
          onExpand={interactionHandlers.onChatExpand}
        />

        {/* Page Sections Container - With left space for chat */}
        <div className="lg:ml-96 lg:pl-8">
          <LandingHeroSection
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            ctaSection={{
              ...heroContent.ctaSection,
              onButtonClick: interactionHandlers.onHeroCtaClick,
            }}
            enhancedSubsections={heroContent.enhancedSubsections}
            limitedTimeCallout={{
              ...heroContent.limitedTimeCallout,
              onButtonClick: interactionHandlers.onLimitedTimeCtaClick,
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

          <IndustryShowcaseSection
            title={industryShowcaseContent.title}
            subtitle={industryShowcaseContent.subtitle}
            industries={industryShowcaseContent.industries}
            trustElements={industryShowcaseContent.trustElements}
            ctaText={industryShowcaseContent.ctaText}
            onCtaClick={interactionHandlers.onIndustryShowcaseCtaClick}
          />

          <SocialProofSection
            title={socialProofContent.title}
            sectionId={socialProofContent.sectionId}
            stats={socialProofContent.stats}
            testimonial={socialProofContent.testimonial}
          />

          <ImplementationTimelineSection
            title={implementationTimelineContent.title}
            subtitle={implementationTimelineContent.subtitle}
            phases={implementationTimelineContent.phases}
            milestones={implementationTimelineContent.milestones}
            trustElements={implementationTimelineContent.trustElements}
            ctaText={implementationTimelineContent.ctaText}
            onCtaClick={interactionHandlers.onTimelineCtaClick}
          />

          <HowItWorksSection
            title={howItWorksContent.title}
            subtitle={howItWorksContent.subtitle}
            sectionId={howItWorksContent.sectionId}
            steps={howItWorksContent.steps}
          />

          <EnhancedGuaranteeSection
            title={enhancedGuaranteeContent.title}
            guarantees={enhancedGuaranteeContent.guarantees}
            ctaText={enhancedGuaranteeContent.ctaText}
            ctaSubtext={enhancedGuaranteeContent.ctaSubtext}
            onCtaClick={interactionHandlers.onEnhancedGuaranteeCtaClick}
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
    </div>
  )
}
