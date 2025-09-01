export const defaultLocale = 'en'
export const locales = ['en', 'es', 'ru'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪��',
  ru: '🇷🇺',
}
