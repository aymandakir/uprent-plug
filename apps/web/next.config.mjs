/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable output file tracing to fix ENOENT errors on Vercel
  outputFileTracing: false,
  
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Compress static assets
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['cdn.uprent.nl', 'res.cloudinary.com'],
    minimumCacheTTL: 60,
  },

  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack optimization
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunks
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js, etc.)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Common libs chunk
            lib: {
              test(module) {
                return (
                  module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier())
                );
              },
              name(module) {
                // Generate hash from module identifier (simplified for webpack)
                const identifier = module.identifier();
                let hash = 0;
                for (let i = 0; i < identifier.length; i++) {
                  const char = identifier.charCodeAt(i);
                  hash = ((hash << 5) - hash) + char;
                  hash = hash & hash; // Convert to 32-bit integer
                }
                return `lib-${Math.abs(hash).toString(36).substring(0, 8)}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common chunks across routes
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            // Shared chunks
            shared: {
              name: false,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
          maxInitialRequests: 25,
          minSize: 20000,
        },
      };
    }

    // Tree shake unused code
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    return config;
  },

  // Removed experimental.optimizeCss - causing build errors
};

export default nextConfig;
