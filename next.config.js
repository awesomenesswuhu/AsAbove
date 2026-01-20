/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This creates a static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'solarsystem.nasa.gov',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.solarsystemscope.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
