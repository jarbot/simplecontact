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
  const config = getConfig();

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: config.theme.backgroundColor,
          color: config.theme.textColor,
        }}
      >
        {children}
      </body>
    </html>
  );
}
