/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        genesis: {
          bg: '#070707',
          surface: '#0e2a2b',
          petro: '#113f42',
          accent: '#1fb5bc',
          accentHover: '#2dd4bf',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
}