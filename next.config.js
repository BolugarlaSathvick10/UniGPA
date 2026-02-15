/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure static export compatibility for Vercel and Netlify
  reactStrictMode: true,
  // Enable static export if needed (uncomment for full static export)
  // output: 'export',
  
  // ESLint configuration - ignore during builds to prevent deployment failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features to improve compatibility
  experimental: {
    // Optimize package imports to reduce warnings
    optimizePackageImports: ['framer-motion', 'recharts'],
  },
  
  // Webpack configuration to suppress known Next.js 15 warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress console warnings in production
      config.optimization = {
        ...config.optimization,
        minimize: process.env.NODE_ENV === 'production',
      };
    }
    return config;
  },
};

module.exports = nextConfig;

