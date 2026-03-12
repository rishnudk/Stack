# Stack Monorepo

Welcome to **Stack**, a high-performance, full-stack monorepo designed for scale and developer velocity. Built with a modern tech stack, it provides a seamless end-to-end type-safe experience.

##  Architecture

This project is a monorepo managed by **Turborepo** and **pnpm workspaces**.

-   **`apps/web`**: A modern frontend built with **Next.js 14**, featuring a rich UI system.
-   **`apps/api`**: A high-speed backend powered by **Fastify**, **Prisma**, and **tRPC**.
-   **`packages/types`**: Shared TypeScript definitions used across the entire stack.
-   **`packages/ui`**: A centralized, reusable component library (based on **Shadcn UI**).
-   **`packages/db`**: Database abstractions and Prisma client management.

## 🛠️ Tech Stack

### Frontend (`apps/web`)
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) & [TanStack Query v5](https://tanstack.com/query/latest)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)

### Backend (`apps/api`)
-   **Server**: [Fastify](https://www.fastify.io/)
-   **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
-   **API Layer**: [tRPC](https://trpc.io/) for end-to-end type safety
-   **Real-time**: [Socket.io](https://socket.io/)

## Monorepo Folder Structure

stack/
│
├── apps/
│   ├── web/                # Next.js frontend (App Router)
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── api/                # Fastify + tRPC backend
│       └── src/
│           ├── modules/    # Feature-based modules
│           │   └── articles/
│           │       ├── article.router.ts
│           │       ├── article.schema.ts
│           │       └── article.service.ts
│           │
│           ├── lib/        # Shared backend utilities
│           ├── trpc/       # tRPC setup
│           └── server.ts
│
├── packages/
│   ├── db/                 # Prisma client & database utilities
│   ├── types/              # Shared TypeScript types
│   └── ui/                 # Shared UI components
│
├── turbo.json              # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json

##  Getting Started

### Prerequisites
-   **Node.js**: v20.x or higher
-   **pnpm**: v9.x or higher
-   **PostgreSQL**: A running instance (or Docker)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rishnudk/Stack.git
    cd Stack
    ```

2.  **Install dependencies**:
    ```bash
    npx pnpm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root and in `apps/api` with your specific configuration (Database URLs, API Secrets, etc.).

4.  **Database Migration**:
    ```bash
    npx pnpm db:generate
    ```

### Running the Project

Run all applications in development mode using Turbo:

```bash
pnpm dev
```

This will concurrently start the Next.js frontend and the Fastify backend.

##  Development Commands

-   `pnpm build`: Build all workspace projects.
-   `pnpm lint`: Run linting across the monorepo.
-   `pnpm db:generate`: Regenerate the Prisma client.
-   `pnpm --filter web dev`: Run only the frontend.
-   `pnpm --filter api dev`: Run only the backend.

##  License

This project is licensed under the **MIT License**.
