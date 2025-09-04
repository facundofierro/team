/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /migrate\.ts$/,
      use: 'null-loader',
    })
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      fs: false,
      path: false,
    }
    return config
  },
  experimental: {
    fallbackNodePolyfills: false,
  },
}

module.exports = nextConfig
