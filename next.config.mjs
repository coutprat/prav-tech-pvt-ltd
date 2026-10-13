/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Every old URL keeps working. `permanent: true` emits a 308, so search
   * engines move the ranking across rather than treating these as new pages.
   */
  async redirects() {
    return [
      // merged into /company
      { source: "/foundry", destination: "/company", permanent: true },
      { source: "/about", destination: "/company", permanent: true },
      { source: "/team", destination: "/company", permanent: true },

      // the product is MENNIE; "HealthMate" is retired everywhere
      { source: "/healthmate", destination: "/mennie", permanent: true },

      // thin pages folded into the pages that carry the same material
      { source: "/domains", destination: "/enterprise-ai", permanent: true },
      { source: "/innovate", destination: "/research", permanent: true },
      { source: "/insights", destination: "/research", permanent: true },

      // the Orbit experience is not part of this redesign
      { source: "/orbit", destination: "/", permanent: false }
    ];
  }
};

export default nextConfig;
