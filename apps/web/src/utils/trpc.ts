import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from '@api/trpc/appRouter';
// import type { AppRouter } from '../trpc/appRouter.ts'; // ✅ use the alias you defined in tsconfig
// Export everything you need from the API



export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc', // ✅ your API server
    }),
  ],
});
