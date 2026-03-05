'use client';

import { SessionProvider } from 'next-auth/react';
import { TrpcProvider } from '../../src/providers/TrpcProvider';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TrpcProvider>{children}</TrpcProvider>
    </SessionProvider>
  );
}
