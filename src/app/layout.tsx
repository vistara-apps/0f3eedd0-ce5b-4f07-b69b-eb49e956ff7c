import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nebula Arena - Dominate the NFT Arena',
  description: 'An NFT battle arena for players to compete, grow, and receive exclusive updates via a newsletter, built as a Base MiniApp.',
  keywords: ['NFT', 'Battle Arena', 'Base', 'Blockchain', 'Gaming', 'Newsletter'],
  authors: [{ name: 'Nebula Arena Team' }],
  creator: 'Nebula Arena',
  publisher: 'Nebula Arena',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Nebula Arena - Dominate the NFT Arena',
    description: 'An NFT battle arena for players to compete, grow, and receive exclusive updates via a newsletter.',
    url: '/',
    siteName: 'Nebula Arena',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nebula Arena - NFT Battle Arena',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebula Arena - Dominate the NFT Arena',
    description: 'An NFT battle arena for players to compete, grow, and receive exclusive updates.',
    images: ['/og-image.png'],
    creator: '@nebula_arena',
  },
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  // Frame metadata for Base Mini App
  other: {
    'fc:frame': 'vNext',
    'fc:frame:title': 'Nebula Arena - NFT Battle Arena',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/frame-image.png`,
    'fc:frame:button:1': 'Enter Arena',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/frames/enter`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
