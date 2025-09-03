'use client'

import { LanguageSwitcher } from './language-switcher'

interface LandingHeaderProps {
  logo?: {
    text: string
    iconLetter: string
  }
  navigation?: Array<{
    label: string
    href: string
  }>
  ctaButton?: {
    text: string
    onClick?: () => void
  }
  onLanguageChange?: (languageCode: string) => void
}

export function LandingHeader({
  logo = {
    text: 'TeamHub',
    iconLetter: 'T',
  },
  navigation = [
    { label: 'Product', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About Us', href: '#about' },
  ],
  ctaButton = {
    text: 'Get Started',
  },
  onLanguageChange,
}: LandingHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md bg-gray-900/80 border-gray-700/50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <span className="text-xl font-bold text-white">
                {logo.iconLetter}
              </span>
            </div>
            <span className="text-2xl font-bold text-white">{logo.text}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-medium text-gray-300 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side - CTA and Language Switcher */}
          <div className="flex items-center space-x-4">
            <button
              className="px-6 py-2 font-semibold text-white bg-pink-500 rounded-lg transition-colors duration-200 hover:bg-pink-600"
              onClick={ctaButton.onClick}
            >
              {ctaButton.text}
            </button>
            <LanguageSwitcher onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </div>
    </header>
  )
}
