import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();

  return {
    title: config.seo.title,
    description: config.seo.description,
    openGraph: config.seo.ogImage ? {
      images: [config.seo.ogImage],
    } : undefined,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
