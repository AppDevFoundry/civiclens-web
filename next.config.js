/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization configuration
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables available to the browser
  env: {
    API_URL: process.env.API_URL || 'https://api.realworld.io/api',
  },

  // Modern compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack configuration (if needed for custom loaders)
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here
    return config;
  },
};

module.exports = nextConfig;
