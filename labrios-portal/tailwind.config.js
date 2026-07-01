/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#003366',
          dark: '#002244',
          light: '#004488',
        },
        ltip: {
          green: '#2E7D32',
          'green-light': '#43A047',
          'green-accent': '#66BB6A',
        }
      }
    }
  },
  plugins: [],
}