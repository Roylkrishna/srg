/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-red': '#991B1B',
        'royal-gold': '#D97706',
        'royal-black': '#111827',
        'gift-cream': '#FDFBF7',
        'gift-gold': '#F4A261',
        'primary': '#991B1B',
        'secondary': '#D97706',
        'accent': '#B45309',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

