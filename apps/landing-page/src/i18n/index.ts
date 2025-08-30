import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, localeNames, localeFlags } from './settings'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) locale = defaultLocale

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})

export { locales, defaultLocale, localeNames, localeFlags } from './settings'
export type { Locale } from './settings'
