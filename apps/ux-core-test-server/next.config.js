/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@teamhub/ux-core'],
}

module.exports = nextConfig
