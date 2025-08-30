'use client'

import { LanguageSwitcher } from './language-switcher'

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white">TeamHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { label: 'Product', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'About Us', href: '#about' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side - CTA and Language Switcher */}
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors duration-200">
              Get Started
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
