import React, { useRef, useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

interface ScrollTriggeredAnimationProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'rotateIn'
  delay?: number
  duration?: number
  once?: boolean
  onVisible?: () => void
}

const animationClasses = {
  fadeIn: 'opacity-0 animate-fade-in',
  slideUp: 'opacity-0 translate-y-8 animate-slide-up',
  slideLeft: 'opacity-0 translate-x-8 animate-slide-left',
  slideRight: 'opacity-0 -translate-x-8 animate-slide-right',
  scaleIn: 'opacity-0 scale-95 animate-scale-in',
  rotateIn: 'opacity-0 rotate-12 animate-rotate-in',
}

const animationKeyframes = {
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'slide-up': {
    '0%': { opacity: '0', transform: 'translateY(2rem)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-left': {
    '0%': { opacity: '0', transform: 'translateX(2rem)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'slide-right': {
    '0%': { opacity: '0', transform: 'translateX(-2rem)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'rotate-in': {
    '0%': { opacity: '0', transform: 'rotate(12deg)' },
    '100%': { opacity: '1', transform: 'rotate(0deg)' },
  },
}

export function ScrollTriggeredAnimation({
  children,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  once = true,
  onVisible,
}: ScrollTriggeredAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (onVisible) onVisible()
          if (once) setHasAnimated(true)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin, once, onVisible])

  const shouldAnimate = isVisible || hasAnimated

  return (
    <>
      <style>{`
        @keyframes fade-in {
          ${animationKeyframes['fade-in']['0%']}
          ${animationKeyframes['fade-in']['100%']}
        }
        @keyframes slide-up {
          ${animationKeyframes['slide-up']['0%']}
          ${animationKeyframes['slide-up']['100%']}
        }
        @keyframes slide-left {
          ${animationKeyframes['slide-left']['0%']}
          ${animationKeyframes['slide-left']['100%']}
        }
        @keyframes slide-right {
          ${animationKeyframes['slide-right']['0%']}
          ${animationKeyframes['slide-right']['100%']}
        }
        @keyframes scale-in {
          ${animationKeyframes['scale-in']['0%']}
          ${animationKeyframes['scale-in']['100%']}
        }
        @keyframes rotate-in {
          ${animationKeyframes['rotate-in']['0%']}
          ${animationKeyframes['rotate-in']['100%']}
        }

        .animate-fade-in {
          animation: fade-in ${duration}ms ease-out ${delay}ms both;
        }
        .animate-slide-up {
          animation: slide-up ${duration}ms ease-out ${delay}ms both;
        }
        .animate-slide-left {
          animation: slide-left ${duration}ms ease-out ${delay}ms both;
        }
        .animate-slide-right {
          animation: slide-right ${duration}ms ease-out ${delay}ms both;
        }
        .animate-scale-in {
          animation: scale-in ${duration}ms ease-out ${delay}ms both;
        }
        .animate-rotate-in {
          animation: rotate-in ${duration}ms ease-out ${delay}ms both;
        }
      `}</style>

      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          shouldAnimate ? 'opacity-100' : animationClasses[animation],
          className
        )}
        style={{
          animationDelay: shouldAnimate ? '0ms' : `${delay}ms`,
          animationDuration: `${duration}ms`,
        }}
      >
        {children}
      </div>
    </>
  )
}

// Staggered animation container for multiple children
interface StaggeredAnimationProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  animation?: ScrollTriggeredAnimationProps['animation']
  threshold?: number
  rootMargin?: string
}

export function StaggeredAnimation({
  children,
  className,
  staggerDelay = 100,
  animation = 'slideUp',
  threshold = 0.1,
  rootMargin = '0px',
}: StaggeredAnimationProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children.map((child, index) => (
        <ScrollTriggeredAnimation
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          threshold={threshold}
          rootMargin={rootMargin}
        >
          {child}
        </ScrollTriggeredAnimation>
      ))}
    </div>
  )
}

// Fade in animation for text
export function FadeInText({
  children,
  className,
  delay = 0,
  duration = 800,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <ScrollTriggeredAnimation
      animation="fadeIn"
      delay={delay}
      duration={duration}
      className={className}
    >
      {children}
    </ScrollTriggeredAnimation>
  )
}

// Slide up animation for cards
export function SlideUpCard({
  children,
  className,
  delay = 0,
  duration = 600,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <ScrollTriggeredAnimation
      animation="slideUp"
      delay={delay}
      duration={duration}
      className={className}
    >
      {children}
    </ScrollTriggeredAnimation>
  )
}
