/** @type {import('tailwindcss').Config} */
import primeui from 'tailwindcss-primeui'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['selector', '[class*="app-dark"]'],
  plugins: [primeui],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  }
}
