/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ui-library/ui'],
  swcMinify: true,
  compress: true,

  // COOP/COEP headers for SharedArrayBuffer (required for FFmpeg.wasm multithreading)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },

  // Optimize FFmpeg.wasm delivery
  webpack: (config) => {
    // Don't bundle FFmpeg.wasm - it will be loaded from CDN
    config.externals = [...(config.externals || []), '@ffmpeg/ffmpeg', '@ffmpeg/util'];
    return config;
  },
};

module.exports = nextConfig;
