/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "base23-server.free.nf",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
