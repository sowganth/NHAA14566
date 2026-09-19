/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f2c59',
          blue: '#1e3a8a',
          lightBlue: '#ebf2fa',
          gold: '#d97706',
          saffron: '#f97316',
          green: '#15803d',
          red: '#dc2626',
          darkRed: '#991b1b',
          grayBg: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
