import type { Metadata } from 'next';
import ClientProviders from './providers/ClientProviders';
import { Toaster } from 'sonner';
import '@/app/globals.css';
export const metadata: Metadata = {
  title: 'Stack',
  description: 'Where Developers Connects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
          <Toaster position="top-right" richColors />
        </ClientProviders>
      </body>
    </html>
  );
}
