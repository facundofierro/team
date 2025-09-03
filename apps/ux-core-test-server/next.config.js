/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@agelum/ux-core'],
}

module.exports = nextConfig
