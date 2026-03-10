# Stack – Developer Social Platform

## Project Overview

Stack is a **developer-focused social networking platform** similar to LinkedIn but tailored for developers. It features a social feed, user profiles with dev stats, real-time messaging (DMs + groups), hashtag-driven content discovery, and a "Hire Me" system. The codebase is a **Turborepo monorepo** managed with **pnpm workspaces**.

## Architecture

```
stack/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   └── api/          # Fastify + tRPC backend
├── packages/
│   ├── types/        # Shared TypeScript type definitions
│   └── ui/           # Reusable Radix-based component library (Shadcn-style)
├── turbo.json        # Turborepo pipeline config
└── pnpm-workspace.yaml
```

## Tech Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 14 (App Router, `output: 'standalone'`)
- **React**: 18.2.0
- **Styling**: Tailwind CSS 4, Framer Motion, GSAP
- **State**: Zustand (client state), TanStack Query v5 (server state)
- **Auth**: NextAuth.js 4 (JWT strategy) — Google, GitHub, Credentials providers
- **API Client**: tRPC React Query (`@trpc/react-query`)
- **UI Primitives**: Radix UI, Lucide React, Shadcn-style components in `src/components/ui/`
- **Real-time**: Socket.io Client
- **Notifications**: Sonner toasts

### Backend (`apps/api`)
- **Server**: Fastify (port 4000)
- **API**: tRPC (mounted at `/trpc`)
- **ORM**: Prisma (PostgreSQL)
- **Real-time**: Socket.io (server-side)
- **Auth**: JWT verification via `jose` / `jsonwebtoken`
- **File Uploads**: AWS S3 presigned URLs
- **Dev Tools**: trpc-panel for API exploration

### Shared Packages
- **`@stack/types`**: Shared TS types for messaging, users, conversations
- **`packages/ui`**: Avatar, Badge, Button, Card, Input, Separator, Textarea

## Key Environment Variables

| Variable | Used By | Purpose |
|---|---|---|
| `DATABASE_URL` | API, Web | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Web | NextAuth session encryption |
| `NEXTAUTH_URL` | Web | NextAuth callback base URL |
| `API_JWT_SECRET` | API, Web | JWT signing for API auth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Web | Google OAuth |
| `GITHUB_ID` / `GITHUB_SECRET` | Web | GitHub OAuth |
| `AWS_*` | API | S3 file upload credentials |

## Database Schema (Prisma)

Core models in `apps/api/prisma/schema.prisma`:

- **User** – Profiles with skills[], socialLinks, headline, bio, avatarUrl, coverUrl, hireable flag
- **Post** – Content with images[], authored by User, associated with optional Group
- **Comment** – Threaded (self-referential `parentId`), linked to Post
- **Like / CommentLike** – Post and comment reactions (unique per user)
- **Follow** – Follower/following relationships
- **Conversation / DirectMessage / ConversationParticipant** – 1:1 DMs
- **Group / GroupMember / GroupMessage** – Group chats with roles (ADMIN/MEMBER), privacy (PUBLIC/PRIVATE)
- **Hashtag / PostHashtag** – Many-to-many hashtag system for content discovery
- **SavedPost** – Bookmarking system
- **View / Impression** – Profile analytics
- **Account / Session / VerificationToken** – NextAuth models

## tRPC Routers (`apps/api/src/trpc/routers/`)

| Router | Namespace | Purpose |
|---|---|---|
| `postRouter` | `posts` | CRUD, feed, trending hashtags, hashtag filtering |
| `commentRouter` | `comments` | Threaded comments on posts |
| `likeRouter` | `likes` | Post like/unlike |
| `userRouter` | `users` | Profile CRUD, follow/unfollow, suggestions, search |
| `uploadRouter` | `upload` | S3 presigned URL generation |
| `devStatsRouter` | `devStats` | LeetCode/GitHub stats integration |
| `hireMeRouter` | `hireMe` | Hire-me profile management |
| `groupRouter` | `groups` | Group CRUD, membership, group messages |
| `messagingRouter` | `messaging` | DM conversations, message sending |

## Frontend Routes (`apps/web/app/`)

| Route | Description |
|---|---|
| `/` | Landing page (redirects to `/feed` if authenticated) |
| `/signin`, `/signup` | Auth pages |
| `/feed` | Main social feed with left sidebar, feed box, right sidebar |
| `/feed/post/[id]` | Individual post view |
| `/profile/[id]` | User profile page |
| `/messages` | Real-time DM interface with conversation list |
| `/hashtag/[tag]` | Posts filtered by hashtag |

## Frontend Structure

```
apps/web/
├── app/                    # Next.js App Router pages
│   ├── api/                # NextAuth API routes
│   ├── components/         # App-level shared components
│   ├── feed/               # Feed page + subcomponents
│   │   ├── components/
│   │   │   ├── LeftSidebar/
│   │   │   ├── RightSidebar/
│   │   │   └── feedbox/
│   │   └── post/
│   ├── landing/            # Landing page components (Hero, Navbar, Bento, Marquee)
│   ├── messages/           # DM interface (ChatWindow, ConversationList, VideoCall)
│   ├── profile/            # Profile page + edit components
│   ├── providers/          # Client-side providers (QueryClient, SessionProvider)
│   ├── signin/ & signup/   # Auth pages
│   └── hashtag/            # Hashtag feed page
├── src/
│   ├── components/ui/      # Shadcn-style reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Auth config (NextAuth), utility functions
│   ├── providers/          # Additional providers
│   ├── server/             # Server-side utilities (Prisma client)
│   └── utils/              # Helper utilities
├── trpc.ts                 # tRPC client initialization
└── next.config.js          # Next.js configuration
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode (via Turborepo)
pnpm dev

# Run individual apps
pnpm --filter web dev     # Frontend on localhost:3000
pnpm --filter api dev     # Backend on localhost:4000

# Database
pnpm db:generate          # Regenerate Prisma client

# Build
pnpm build                # Build types package first, then API

# Clean Next.js cache
pnpm --filter web clean
```

## Conventions & Patterns

- **Auth flow**: NextAuth JWT → API token signed with `API_JWT_SECRET` → passed in tRPC requests for backend auth
- **tRPC context**: Extracts JWT from `Authorization` header, verifies with `jose`, attaches `userId` to context
- **Component organization**: Page-specific components live inside their route directory (e.g., `feed/components/`); reusable UI primitives in `src/components/ui/`
- **Styling**: Tailwind CSS 4 with `class-variance-authority` for component variants, `tailwind-merge` for class merging, `clsx` for conditional classes
- **State management**: Zustand for client-only state; TanStack Query for all server data fetching via tRPC
- **Real-time**: Socket.io for live messaging; `SocketContext.tsx` provides the socket instance
- **Image hosting**: AWS S3 with presigned upload URLs; Next.js `remotePatterns` configured for S3, GitHub, Google, Unsplash
- **Monorepo imports**: Use `workspace:*` protocol for internal packages (`@stack/types`); path aliases configured via `tsconfig.json` (`@/` maps to `src/`)
