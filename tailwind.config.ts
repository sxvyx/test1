import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables dark mode class styling
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
