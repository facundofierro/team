import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Container } from '../layout'

interface HeaderProps {
  className?: string
  transparent?: boolean
  sticky?: boolean
  showLogo?: boolean
  navigationItems?: NavigationItem[]
  ctaText?: string
  onCtaClick?: () => void
}

interface NavigationItem {
  label: string
  href: string
  external?: boolean
}

const defaultNavigationItems: NavigationItem[] = [
  { label: 'Product', href: '#product' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About Us', href: '#about' },
]

export function Header({
  className,
  transparent = false,
  sticky = true,
  showLogo = true,
  navigationItems = defaultNavigationItems,
  ctaText = 'Get Started',
  onCtaClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        'w-full z-50 transition-all duration-300',
        sticky && 'sticky top-0',
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm border-b border-teamhub-border/20',
        className
      )}
    >
      <Container size="lg" padding="md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {showLogo && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold text-teamhub-secondary">
                TeamHub
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'text-teamhub-secondary hover:text-teamhub-primary transition-colors font-medium',
                  transparent && 'text-white hover:text-teamhub-accent'
                )}
                {...(item.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            {onCtaClick ? (
              <button
                onClick={onCtaClick}
                className={cn(
                  'px-6 py-2 rounded-lg font-semibold transition-all duration-200',
                  transparent
                    ? 'bg-white text-teamhub-secondary hover:bg-teamhub-accent hover:text-white'
                    : 'bg-teamhub-primary text-white hover:bg-teamhub-primary/90'
                )}
              >
                {ctaText}
              </button>
            ) : (
              <a
                href="#get-started"
                className={cn(
                  'px-6 py-2 rounded-lg font-semibold transition-all duration-200',
                  transparent
                    ? 'bg-white text-teamhub-secondary hover:bg-teamhub-accent hover:text-white'
                    : 'bg-teamhub-primary text-white hover:bg-teamhub-primary/90'
                )}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={cn(
                  'w-5 h-0.5 bg-teamhub-secondary transition-all duration-300',
                  isMobileMenuOpen && 'rotate-45 translate-y-1',
                  transparent && 'bg-white'
                )}
              />
              <span
                className={cn(
                  'w-5 h-0.5 bg-teamhub-secondary mt-1 transition-all duration-300',
                  isMobileMenuOpen && 'opacity-0',
                  transparent && 'bg-white'
                )}
              />
              <span
                className={cn(
                  'w-5 h-0.5 bg-teamhub-secondary mt-1 transition-all duration-300',
                  isMobileMenuOpen && '-rotate-45 -translate-y-1',
                  transparent && 'bg-white'
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-teamhub-border/20">
            <nav className="flex flex-col space-y-4 pt-4">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-teamhub-secondary hover:text-teamhub-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                  {...(item.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {item.label}
                </a>
              ))}
              {onCtaClick ? (
                <button
                  onClick={() => {
                    onCtaClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="mt-4 px-6 py-2 bg-teamhub-primary text-white rounded-lg font-semibold hover:bg-teamhub-primary/90 transition-colors"
                >
                  {ctaText}
                </button>
              ) : (
                <a
                  href="#get-started"
                  className="mt-4 px-6 py-2 bg-teamhub-primary text-white rounded-lg font-semibold hover:bg-teamhub-primary/90 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaText}
                </a>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}
