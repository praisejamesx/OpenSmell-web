// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable Turbopack but keep it empty for now
  turbopack: {},
  // Remove webpack config for now to avoid conflicts
}

export default nextConfig