# Portfolio Website - Full Stack Application

## Overview

This is a modern full-stack portfolio website built for Jayan Patel, a Full Stack Developer. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database integration. It showcases a professional portfolio with sections for about, projects, and contact functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth animations
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: ESBuild for server bundling
- **Development**: tsx for TypeScript execution
- **Session Storage**: PostgreSQL-based session storage (connect-pg-simple)

### Key Design Decisions
1. **Monorepo Structure**: Single repository with client, server, and shared folders for code reuse
2. **TypeScript First**: Full TypeScript implementation for type safety
3. **Modern UI**: Dark theme with gradient accents and particle animations
4. **Responsive Design**: Mobile-first approach with adaptive layouts
5. **Performance**: Optimized builds and lazy loading strategies

## Key Components

### Frontend Components
- **Navigation**: Fixed navigation with theme toggle and mobile menu
- **ParticleBackground**: Interactive particle animation system
- **TypingAnimation**: Animated text typing effect
- **ThemeProvider**: Dark/light theme management
- **Page Components**: Home, About, Projects, Contact pages
- **UI Library**: Complete shadcn/ui component collection

### Backend Components
- **Routes**: RESTful API endpoints for contact form and data retrieval
- **Storage**: Abstracted storage layer with in-memory and database implementations
- **Middleware**: Request logging and error handling
- **Vite Integration**: Development server with HMR support

### Database Schema
- **Users Table**: Basic user management (id, username, password)
- **Contacts Table**: Contact form submissions (id, name, email, subject, message, created_at)
- **Schema Validation**: Zod schemas for runtime validation

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle HTTP requests and validate data
3. **Business Logic**: Storage layer abstracts database operations
4. **Database**: PostgreSQL stores persistent data via Drizzle ORM
5. **Response**: JSON responses sent back to client components

### Contact Form Flow
1. User fills out contact form on frontend
2. Form data validated with Zod schemas
3. POST request sent to `/api/contact` endpoint
4. Backend validates and stores contact in database
5. Success/error response returned to client
6. Toast notification displayed to user

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **Animation**: Framer Motion, Embla Carousel
- **State Management**: TanStack Query
- **Validation**: Zod, @hookform/resolvers
- **Utilities**: clsx, class-variance-authority, date-fns

### Backend Dependencies
- **Server**: Express.js, TypeScript
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple
- **Development**: tsx, esbuild, Vite

### Development Tools
- **Build**: Vite, ESBuild, PostCSS
- **Type Checking**: TypeScript compiler
- **Database**: Drizzle Kit for migrations
- **Fonts**: Google Fonts (Inter, Space Grotesk)

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static assets served from build directory

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Development**: Node.js development server with HMR
- **Production**: Compiled bundle served by Express

### Database Setup
- **Migrations**: Drizzle migrations in `./migrations` directory
- **Schema**: Shared schema definitions in `./shared/schema.ts`
- **Push**: `npm run db:push` command for schema deployment

### Development Workflow
1. `npm run dev` - Start development server with HMR
2. `npm run build` - Build production bundles
3. `npm run start` - Start production server
4. `npm run db:push` - Update database schema

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.