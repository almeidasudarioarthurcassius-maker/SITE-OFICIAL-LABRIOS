import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#003366",
          dark: "#002244",
          light: "#004488",
        },
        green: {
          DEFAULT: "#2E7D32",
          light: "#43A047",
          accent: "#66BB6A",
        },
      },
      borderRadius: {
        lg: "8px",
      },
    },
  },
  plugins: [],
};
export default config;