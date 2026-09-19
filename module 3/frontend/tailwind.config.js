/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nhaa: {
          blue: "#0f3c5c",
          gold: "#d4af37",
          dark: "#1e293b",
          light: "#f8fafc",
          critical: "#dc2626",
          high: "#ea580c",
          moderate: "#d97706",
          low: "#16a34a"
        }
      }
    },
  },
  plugins: [],
}
