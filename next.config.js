/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable experimental features as needed
  experimental: {
    // Enable typed routes for better TypeScript support
    typedRoutes: false,
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Webpack configuration (if needed)
  webpack: (config, { isServer }) => {
    // Custom webpack config can be added here
    return config;
  },
};

module.exports = nextConfig;
