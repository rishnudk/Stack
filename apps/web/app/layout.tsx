import type { Metadata } from 'next';
import ClientProviders from '@/providers/ClientProviders';
import { Toaster } from 'sonner';
import './globals.css';

const APP_URL = 'https://stackkk.vercel.app';
const APP_NAME = 'Stack';
const APP_DESCRIPTION =
  'Stack is the developer social network. Share projects, follow top engineers, discover trending tech, and build your engineering brand.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: `${APP_NAME} — The Developer Social Network`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'developer network',
    'dev social',
    'engineer community',
    'coding',
    'programming',
    'tech jobs',
    'github',
    'open source',
    'software engineering',
    'dev platform',
  ],
  authors: [{ name: 'Stack', url: APP_URL }],
  creator: 'Stack',
  publisher: 'Stack',
  applicationName: APP_NAME,

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — The Developer Social Network`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stack — The Developer Social Network',
      },
    ],
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@usestack',
    creator: '@usestack',
    title: `${APP_NAME} — The Developer Social Network`,
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification (add when you connect Google Search Console) ──────────────
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_TOKEN',
  // },
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
