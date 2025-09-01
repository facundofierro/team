import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  // Always show the locale in the URL
  localePrefix: 'always',

  // Domains can be configured to support different locales
  // domains: [
  //   {
  //     domain: 'teamhub.ai',
  //     defaultLocale: 'en'
  //   },
  //   {
  //     domain: 'teamhub.es',
  //     defaultLocale: 'es'
  //   },
  //   {
  //     domain: 'teamhub.ru',
  //     defaultLocale: 'ru'
  //   }
  // ]
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en|ru)/:path*'],
}
