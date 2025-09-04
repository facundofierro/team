# Agelum Landing Page

A modern, conversion-focused landing page for Agelum built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Performance Optimized**: Fast loading times and Core Web Vitals optimization
- **SEO Ready**: Meta tags, structured data, and search engine optimization
- **Internationalization**: Support for English, Spanish, and Russian
- **Analytics Integration**: PostHog integration for comprehensive tracking
- **Component Library**: Integration with UX-core and external component libraries

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Access to the Agelum monorepo

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## Development

### Adding New Components

1. Create components in `src/components/`
2. Follow the established naming conventions
3. Use TypeScript interfaces for props
4. Implement proper accessibility features

### Styling

- Use Tailwind CSS classes
- Follow the established design system
- Use CSS custom properties for theming
- Implement responsive design patterns

### State Management

- Use Zustand stores for client-side state
- Keep stores focused and minimal
- Implement proper TypeScript types

## Deployment

The landing page is configured for deployment with:

- **Build Optimization**: Turbo build pipeline integration
- **Performance**: Core Web Vitals optimization
- **SEO**: Meta tags and structured data
- **Analytics**: PostHog integration

## Contributing

1. Follow the established coding standards
2. Use TypeScript strictly
3. Implement proper error handling
4. Test on multiple devices and browsers
5. Ensure accessibility compliance

## License

Private - Agelum internal use only.
