/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "solmusic.fun",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
