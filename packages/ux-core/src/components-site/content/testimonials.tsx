import React from 'react'
import { cn } from '../../utils/cn'

interface Testimonial {
  id: string
  quote: string
  author: string
  position?: string
  company?: string
  avatar?: string
  rating?: number
  date?: string
  featured?: boolean
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
  layout?: 'grid' | 'carousel' | 'list'
  cols?: 1 | 2 | 3
  gap?: 'sm' | 'md' | 'lg'
  size?: 'sm' | 'md' | 'lg'
  showRating?: boolean
  showDate?: boolean
  centered?: boolean
}

const layoutClasses = {
  grid: 'grid',
  carousel: 'flex overflow-x-auto space-x-6 pb-4',
  list: 'flex flex-col',
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 lg:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

const gaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const ratingStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <svg
      key={i}
      className={cn(
        'w-4 h-4',
        i < rating ? 'text-teamhub-success fill-current' : 'text-teamhub-muted'
      )}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ))
}

export function Testimonials({
  testimonials,
  className,
  layout = 'grid',
  cols = 3,
  gap = 'lg',
  size = 'md',
  showRating = true,
  showDate = false,
  centered = true,
}: TestimonialsProps) {
  return (
    <div
      className={cn(
        layoutClasses[layout],
        layout === 'grid' && gridCols[cols],
        layout === 'grid' && gaps[gap],
        className
      )}
    >
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className={cn(
            'bg-white border border-teamhub-border/20 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md',
            sizes[size],
            testimonial.featured && 'ring-2 ring-teamhub-primary/20',
            layout === 'carousel' && 'flex-shrink-0 w-80',
            layout === 'list' && 'mb-6 last:mb-0'
          )}
        >
          {/* Rating */}
          {showRating && testimonial.rating && (
            <div className="flex items-center space-x-1 mb-4">
              {ratingStars(testimonial.rating)}
            </div>
          )}

          {/* Quote */}
          <blockquote className="mb-6">
            <p className="text-teamhub-secondary leading-relaxed italic">
              "{testimonial.quote}"
            </p>
          </blockquote>

          {/* Author */}
          <div className="flex items-center space-x-3">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-full flex items-center justify-center text-white font-semibold">
                {testimonial.author.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-teamhub-secondary">
                {testimonial.author}
              </div>
              {testimonial.position && (
                <div className="text-sm text-teamhub-muted">
                  {testimonial.position}
                </div>
              )}
              {testimonial.company && (
                <div className="text-sm text-teamhub-primary font-medium">
                  {testimonial.company}
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          {showDate && testimonial.date && (
            <div className="mt-4 pt-4 border-t border-teamhub-border/20">
              <span className="text-xs text-teamhub-muted">
                {testimonial.date}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Featured Testimonial for highlighting key testimonials
interface FeaturedTestimonialProps {
  testimonial: Testimonial
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showRating?: boolean
  showDate?: boolean
}

export function FeaturedTestimonial({
  testimonial,
  className,
  size = 'lg',
  showRating = true,
  showDate = false,
}: FeaturedTestimonialProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-teamhub-primary to-teamhub-accent text-white rounded-2xl p-8 shadow-xl',
        className
      )}
    >
      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className="flex items-center space-x-1 mb-6">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={cn(
                'w-5 h-5',
                i < testimonial.rating!
                  ? 'text-white fill-current'
                  : 'text-white/50'
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="mb-8">
        <p className="text-xl leading-relaxed italic opacity-95">
          "{testimonial.quote}"
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center space-x-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-lg">{testimonial.author}</div>
          {testimonial.position && (
            <div className="text-white/80">{testimonial.position}</div>
          )}
          {testimonial.company && (
            <div className="text-white/90 font-medium">
              {testimonial.company}
            </div>
          )}
        </div>
      </div>

      {/* Date */}
      {showDate && testimonial.date && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <span className="text-sm text-white/70">{testimonial.date}</span>
        </div>
      )}
    </div>
  )
}
