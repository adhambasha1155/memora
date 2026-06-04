import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledJsx: true,
  },
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
