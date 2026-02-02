import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
          nonce={nonce}
        />
      </head>
      <body className="min-h-screen" data-nonce={nonce}>
        {children}
      </body>
    </html>
  );
}
