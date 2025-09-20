# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tube Insights is a data-driven YouTube analytics application that helps content creators analyze comments on AI-related videos and generate new video ideas. Built with Next.js 15, Google's Genkit AI framework, and ShadCN UI components.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Runs on port 9002 with Turbo mode enabled.

### Genkit AI Development
```bash
npm run genkit:dev    # Start Genkit with dev server
npm run genkit:watch  # Start Genkit with auto-reload
```

### Build & Production
```bash
npm run build  # Create production build
npm run start  # Start production server
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
```

## Environment Setup

Required environment variables (create `.env.local`):
- `YOUTUBE_API_KEY` - Google YouTube Data API v3 key
- `GOOGLE_GENAI_API_KEY` - Google AI (Gemini) API key for Genkit

## Architecture Overview

### Core Flow
1. **Search Videos**: Users search for YouTube videos using AI-related keywords
2. **Fetch & Analyze**: App fetches videos with comments via YouTube API
3. **Project Creation**: Users select videos to create analysis projects
4. **AI Chat**: Chat interface powered by Genkit/Gemini for comment analysis
5. **Insights Generation**: AI analyzes patterns in comments to suggest video ideas

### Key Components

**Frontend Structure**:
- `/src/app/` - Next.js 15 app router pages
- `/src/components/dashboard.tsx` - Main application interface with video search, project management, and chat
- `/src/components/ui/` - ShadCN UI component library (40+ components)
- State management via React hooks (useState, useCallback, useMemo)

**AI Integration** (`/src/ai/`):
- `genkit.ts` - Genkit AI instance configuration with Google AI plugin
- `flows/chat-flow.ts` - Chat context flow using Gemini 1.5 Flash for comment analysis
- Server actions with 'use server' directive for API calls

**Services**:
- `youtube-service.ts` - YouTube API integration for video/comment fetching
  - Fetches up to 10 videos per search
  - Retrieves 20 most relevant comments per video
  - Server-side execution with googleapis client

**Type System**:
- Strong TypeScript throughout with Zod schema validation
- Core types in `/src/lib/types.ts`: Video, Project, ChatMessage
- Input/output schemas for AI flows

### Design System

Dark theme with tech-focused aesthetics:
- Background: #121212 (dark gray)
- Primary: #7CFC00 (electric green)
- Accent: #A020F0 (purple)
- Font: Inter (grotesque sans-serif)
- Glassmorphism effects on cards
- Smooth transitions and loading states

### Data Flow

1. **Video Search**: Client → Server Action → YouTube API → Client State
2. **Project Creation**: Selected videos → Local state management
3. **Chat Context**: Project videos + User prompt → Genkit Flow → Gemini API → Response
4. **Comment Analysis**: Raw comments → AI prompt engineering → Structured insights

## Technical Notes

- Next.js 15 with Turbopack for fast development builds
- Server Components by default, Client Components marked with 'use client'
- Path aliasing: `@/` maps to `./src/`
- Radix UI primitives wrapped with custom styling via class-variance-authority
- Firebase integration available but currently unused
- Transcript functionality disabled (placeholder in video service)