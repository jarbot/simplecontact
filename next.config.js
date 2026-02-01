/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support both SSG and SSR
  // For SSG: set output to 'export' in production if needed
  // For SSR: leave as default for Vercel deployment

  // Enable server-side features
  experimental: {
    // Enable server actions for form handling
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

module.exports = nextConfig;
