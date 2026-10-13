import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      // Tooling worktrees; not part of this project
      ".claude/**",
      "node_modules/**",
      "legacy-static-site/**",
      "assets/**",
      "public/site.js",
      "public/vendor/**",
      "*.html",
      // CommonJS dev-only static server; not part of the Next build
      ".local-static-server.cjs"
    ]
  },
  ...nextVitals,
  ...nextTypescript,
  {
    /**
     * React Three Fiber is imperative by design: the whole point of useFrame
     * is to mutate three.js objects (camera position, material uniforms,
     * buffer attributes) every frame, outside React's render. The React
     * Compiler lint rules correctly forbid that pattern in ordinary
     * components and are wrong about it here, so they are scoped off for the
     * 3D layer only. Everything else in the codebase still obeys them.
     */
    files: ["components/three/**/*.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off"
    }
  }
];

export default config;
