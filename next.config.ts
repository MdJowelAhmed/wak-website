const nextConfig = {
  env: {
    IMG_URL: process.env.IMG_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: [
    '10.10.26.174',
    '10.10.26.176',
    '10.10.26.172',
    '10.10.26.*',
    '10.*.*.*',
    '192.168.*.*',
    'localhost',
  ],
};

export default nextConfig;