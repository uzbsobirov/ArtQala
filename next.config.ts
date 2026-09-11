import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent the site from being framed by another origin (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop browsers from MIME-sniffing responses away from their declared Content-Type.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Don't leak full referrer URLs (which can contain ids/tokens) to third-party origins.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features this site never uses.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/auth/signin',
        destination: '/signin',
        permanent: true,
      },
      {
        source: '/auth/signup',
        destination: '/signup',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
