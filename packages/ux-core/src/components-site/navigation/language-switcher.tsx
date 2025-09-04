'use client'

import { useState } from 'react'
import { siteColors, siteUtils } from '../colors'

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageSwitcherProps {
  languages?: Language[]
  currentLanguage?: Language
  onLanguageChange?: (languageCode: string) => void
}

export function LanguageSwitcher({
  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ],
  currentLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = currentLanguage || languages[0] // Default to first language

  const handleLanguageChange = (languageCode: string) => {
    onLanguageChange?.(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-2 space-x-2 text-white rounded-lg border backdrop-blur-sm transition-colors duration-200 ${siteColors.backgrounds.glass} ${siteColors.borders.gray700} hover:bg-gray-700/60`}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium">{currentLang.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border shadow-xl backdrop-blur-md bg-gray-800/90 ${siteColors.borders.gray700}`}
        >
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700/60 transition-colors duration-200 ${
                  lang.code === currentLang.code
                    ? 'bg-gray-700/60 text-white'
                    : `${siteColors.text.gray200}`
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {lang.code === currentLang.code && (
                  <svg
                    className={`ml-auto w-4 h-4 ${siteUtils.status.success}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
