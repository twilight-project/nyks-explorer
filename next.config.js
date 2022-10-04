/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BACKEND_API_URL: 'https://fork-check.com/',
    RPC_URL: 'https://nyks.twilight-explorer.com/tendermint/',
    TWILIGHT_API_URL: 'https://nyks.twilight-explorer.com/api/',
  },
};

module.exports = nextConfig;
