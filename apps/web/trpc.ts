// app/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@api/trpc/appRouter';

export const trpc = createTRPCReact<AppRouter>();
