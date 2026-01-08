import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s - Islam Kit',
    default: 'Islam Kit - Zero-dependency Islamic utilities for JavaScript',
  },
  description: 'Zero-dependency, type-safe utilities for prayer times, Qibla direction, and Quran data. Works everywhere.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
