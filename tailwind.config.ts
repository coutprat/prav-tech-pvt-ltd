import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-d)"],
        body: ["var(--font-b)"],
        mono: ["var(--font-m)"]
      }
    }
  },
  plugins: []
};

export default config;
