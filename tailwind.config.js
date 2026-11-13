/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf8f2',
          100: '#f5eee0',
          200: '#eadabf',
          300: '#dec299',
          400: '#d0a46f',
          500: '#c58b4f', // Dorado / Ámbar principal
          600: '#b2733d',
          700: '#945833',
          800: '#79472e',
          900: '#643c29',
          950: '#381f14',
        },
        dark: {
          850: '#1a1f2c',
          900: '#121620',
          950: '#0b0e14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
