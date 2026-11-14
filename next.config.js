/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  images: {
    domains: [],
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
