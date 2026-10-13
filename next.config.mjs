/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Every old URL keeps working.
   *
   * Explicit 301 rather than Next's `permanent: true`, which emits a 308.
   * Both are permanent and Google treats them the same, but 301 is what the
   * brief asked for and is the more universally understood status — some
   * older proxies and link checkers still handle 308 poorly.
   */
  async redirects() {
    return [
      // merged into /company
      { source: "/foundry", destination: "/company", statusCode: 301 },
      { source: "/about", destination: "/company", statusCode: 301 },
      { source: "/team", destination: "/company", statusCode: 301 },

      // the product is MENNIE; "HealthMate" is retired everywhere
      { source: "/healthmate", destination: "/mennie", statusCode: 301 },

      // thin pages folded into the pages that carry the same material
      { source: "/domains", destination: "/enterprise-ai", statusCode: 301 },
      { source: "/innovate", destination: "/research", statusCode: 301 },
      { source: "/insights", destination: "/research", statusCode: 301 },

      // the Orbit experience is not part of this redesign
      { source: "/orbit", destination: "/", statusCode: 307 }
    ];
  }
};

export default nextConfig;
