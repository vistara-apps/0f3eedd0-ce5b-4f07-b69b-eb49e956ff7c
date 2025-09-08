/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'nftstorage.link'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_NEWSLETTER_API_URL: process.env.NEXT_PUBLIC_NEWSLETTER_API_URL,
    NEXT_PUBLIC_FARCASTER_HUB_URL: process.env.NEXT_PUBLIC_FARCASTER_HUB_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
