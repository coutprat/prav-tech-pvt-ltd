import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "legacy-static-site/**",
      "assets/**",
      "public/site.js",
      "public/vendor/**",
      "*.html"
    ]
  },
  ...nextVitals,
  ...nextTypescript
];

export default config;
