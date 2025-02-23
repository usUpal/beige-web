/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_API_ENDPOINT,
    googleClientId: process.env.googleClientId,
    CDN_URL: process.env.CDN_URL,
    BucketUrl: process.env.BucketUrl,
    appName: process.env.appName,
  },
  images: {
    domains: ['storage.googleapis.com', 'cdn.vectorstock.com', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;
