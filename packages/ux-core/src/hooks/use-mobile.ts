import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)
  const TABLET_BREAKPOINT = 1024

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsTablet(
        window.innerWidth < TABLET_BREAKPOINT &&
          window.innerWidth >= MOBILE_BREAKPOINT
      )
    }
    mql.addEventListener('change', onChange)
    setIsTablet(
      window.innerWidth < TABLET_BREAKPOINT &&
        window.innerWidth >= MOBILE_BREAKPOINT
    )
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isTablet
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined
  )
  const DESKTOP_BREAKPOINT = 1024

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const onChange = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isDesktop
}
