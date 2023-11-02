/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, { isServer, dev }) {
    // Enable webassembly
    config.experiments = { asyncWebAssembly: true, layers: true };

    // In prod mode and in the server bundle (the place where this "chunks" bug
    // appears), use the client static directory for the same .wasm bundle
    config.output.webassemblyModuleFilename =
      isServer && !dev ? '../static/wasm/[id].wasm' : 'static/wasm/[id].wasm';

    // Ensure the filename for the .wasm bundle is the same on both the client
    // and the server (as in any other mode the ID's won't match)
    config.optimization.moduleIds = 'named';

    return config;
  },
  env: {
    BACKEND_API_URL: 'https://fork-check.com/',
    RPC_URL: 'https://nyks.twilight-explorer.com/tendermint/',
    TWILIGHT_API_URL: 'https://nyks.twilight-explorer.com/api/',
  },
};

module.exports = nextConfig;
