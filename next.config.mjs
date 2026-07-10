/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/domains", destination: "/foundry#domains", permanent: true },
      { source: "/about", destination: "/foundry", permanent: true }
    ];
  }
};

export default nextConfig;
