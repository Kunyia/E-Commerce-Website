import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171412",
        blush: "#d96986",
        rouge: "#9f234b",
        petal: "#fff1f4",
        pearl: "#fbfaf7",
        sage: "#7c8b77",
        gold: "#c8a35d"
      },
      boxShadow: {
        soft: "0 18px 70px rgba(23, 20, 18, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
