import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          lg: "10px",
        },
      },
      colors: {
        "accent": "#34d399",
        "destructive": "#ec4899",
        "confirm": "#22d3ee",
        "backgroundPrimary": "#d1d5db",
        "backgroundAccent": "#9ca3af",
      },
    },
  },
  plugins: [
     require('tailwind-scrollbar'),
  ],
};

export default config;
