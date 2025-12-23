/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure path aliases work correctly
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
