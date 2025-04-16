# Migration Guide: React Router to Next.js

This document outlines the step-by-step process to migrate the project from React Router to Next.js.

## Current Stack Analysis

- React Router v7.5.0
- Vite as build tool
- TypeScript
- Tailwind CSS v4
- Shadcn UI components
- PostHog analytics
- Various UI libraries and utilities

## Migration Stages

### Stage 1: Project Setup and Configuration

1. Create a new Next.js project with TypeScript
   ```bash
   npx create-next-app@latest tweakcn-next --typescript --tailwind --app --src-dir
   ```
2. Install required dependencies from current `package.json`
3. Set up Tailwind CSS configuration
4. Configure PostHog analytics
5. Set up environment variables

### Stage 2: Directory Structure Migration

1. Migrate `src` directory structure to Next.js app directory
   - Move pages to `app` directory
   - Convert route files to Next.js page components
   - Set up layout files
   - Configure metadata

### Stage 3: Component Migration

1. Migrate UI components
   - Move components to appropriate locations
   - Update imports to use Next.js conventions
   - Update component props and types
2. Migrate hooks and utilities
3. Update form handling and validation
4. Migrate state management

### Stage 4: Routing Migration

1. Convert React Router routes to Next.js pages
   - `/` → `app/page.tsx`
   - `/editor/theme` → `app/editor/theme/page.tsx`
   - `*` → `app/not-found.tsx`
2. Update navigation components
3. Implement Next.js routing features
4. Set up API routes if needed

### Stage 5: Data Fetching and State Management

1. Migrate React Query setup
2. Update data fetching patterns
3. Implement Next.js data fetching methods
4. Update state management patterns

### Stage 6: Styling and Theme Migration

1. Migrate Tailwind CSS configuration
2. Update theme system
3. Migrate custom styles
4. Update CSS modules if any

### Stage 7: Build and Deployment

1. Update build scripts
2. Configure Next.js build settings
3. Set up deployment pipeline
4. Test production build

### Stage 8: Testing and Optimization

1. Test all routes and functionality
2. Optimize performance
3. Implement Next.js optimizations
4. Test SEO and metadata

## Detailed Steps

### Stage 1: Project Setup

1. Initialize Next.js project
2. Install dependencies:
   ```bash
   npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities @hookform/resolvers @ngard/tiny-isequal @radix-ui/* class-variance-authority clsx cmdk culori date-fns embla-carousel-react input-otp isbot lucide-react motion next-themes nuqs posthog-js react-day-picker react-hook-form react-resizable-panels recharts screenfull sonner tailwind-merge vaul vite-plugin-svgr zod zustand
   ```
3. Set up PostHog in `app/layout.tsx`
4. Configure environment variables

### Stage 2: Directory Structure

1. Create app directory structure:
   ```
   app/
   ├── layout.tsx
   ├── page.tsx
   ├── editor/
   │   └── theme/
   │       └── page.tsx
   └── not-found.tsx
   ```
2. Migrate metadata and links from `root.tsx` to `app/layout.tsx`

### Stage 3: Component Migration

1. Create components directory:
   ```
   components/
   ├── ui/
   ├── forms/
   └── layout/
   ```
2. Update component imports to use Next.js conventions
3. Migrate shared components

### Stage 4: Routing

1. Convert route files to Next.js pages
2. Update navigation components
3. Implement Next.js routing features
4. Set up error handling

### Stage 5: Data Management

1. Set up React Query in Next.js
2. Migrate data fetching patterns
3. Update state management
4. Implement server components where appropriate

### Stage 6: Styling

1. Migrate Tailwind configuration
2. Update theme system
3. Migrate custom styles
4. Test responsive design

### Stage 7: Build

1. Update package.json scripts
2. Configure Next.js build settings
3. Set up deployment pipeline
4. Test production build

### Stage 8: Testing

1. Test all routes
2. Optimize performance
3. Test SEO
4. Verify analytics

## Post-Migration Checklist

- [ ] All routes working correctly
- [ ] Components rendering properly
- [ ] Data fetching working
- [ ] Styling consistent
- [ ] Analytics tracking
- [ ] SEO metadata
- [ ] Performance optimized
- [ ] Error handling in place
- [ ] Deployment working

## Notes

- Keep the current project running until migration is complete
- Test each stage thoroughly before moving to the next
- Use Next.js documentation for reference
- Consider using Next.js features like Server Components and App Router
