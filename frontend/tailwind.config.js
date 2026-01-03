/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gift-red': '#E63946',
        'gift-dark-red': '#D62828',
        'gift-cream': '#FDFBF7',
        'gift-gold': '#F4A261',
        'gift-brown': '#2A9D8F', // Replacing with a nice teal for contrast or keep brown? Let's stick to the prompt's warm theme. 
        // Actually, let's use a nice gold/orange for accents
        'primary': '#E63946',
        'secondary': '#F4A261',
        'accent': '#2A9D8F',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}

