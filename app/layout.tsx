import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'SILAKARADMIN Damkar Ponorogo',
  manifest: '/manifest.json',
  icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
