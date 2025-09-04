console.log('NEXTAUTH_URL at build:', process.env.NEXTAUTH_URL)
console.log('ALLOWED_EMAILS at build:', process.env.ALLOWED_EMAILS)
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    config.externals = config.externals || []
    config.externals.push('pg-cloudflare', 'chromium-bidi', 'electron')

    config.module.rules.push({
      test: /\.ttf$/,
      use: ['url-loader'],
    })

    config.module.rules.push({
      test: /\.html$/,
      use: ['null-loader'],
    })

    // Handle Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        net: false,
        tls: false,
        'pg-native': false,
        bindings: false,
      }
    }

    if (isServer) {
      config.externals.push('chromium-bidi', 'electron')
    }

    return config
  },
  images: {
    remotePatterns: [
      // ... existing code ...
    ],
  },
  experimental: {
    clientTraceMetadata: [
      // ... existing code ...
      'x-vercel-id',
    ],
  },
}

export default nextConfig
