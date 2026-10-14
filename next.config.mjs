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
/**
   * Security headers.
   *
   * These exist because of who buys from us. A pharma QA team, an enterprise
   * IT function and a data-centre operator all run a header scan as part of
   * vendor review, and an F on securityheaders.com is friction that arrives
   * right when a deal is being evaluated. None of this is expensive.
   *
   * The CSP is the one worth reading. It is deliberately not `unsafe-eval`,
   * but it does allow `unsafe-inline` for scripts and styles, and that is an
   * honest limitation rather than an oversight:
   *
   *   - Next injects inline bootstrap scripts and inline flight data on every
   *     page, and the theme is applied by an inline script before first paint
   *     specifically so dark mode does not flash. Removing `unsafe-inline`
   *     means nonces on every one of those, which Next supports only through
   *     middleware on dynamic rendering — and this site is almost entirely
   *     static, which is what makes it fast.
   *   - So the CSP here is worth having for what it does block: no foreign
   *     script origins, no frames, no plugins, no form posts off-origin, and
   *     no one embedding us in an iframe.
   *
   * Revisit if the site ever moves to dynamic rendering, where nonces become
   * cheap.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "manifest-src 'self'",
      "upgrade-insecure-requests"
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Two years, with subdomains, and preload-eligible.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here needs a camera, a microphone or a location.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()"
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" }
        ]
      }
    ];
  },

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

      // The research page is gone. The work behind it is not: it is now the
      // origin story on /company, told without naming individual projects.
      { source: "/research", destination: "/company", statusCode: 301 },
      { source: "/innovate", destination: "/company", statusCode: 301 },
      { source: "/insights", destination: "/company", statusCode: 301 },

      // the Orbit experience is not part of this redesign
      { source: "/orbit", destination: "/", statusCode: 307 }
    ];
  }
};

export default nextConfig;
