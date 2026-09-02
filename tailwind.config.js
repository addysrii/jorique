/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F5',
        primary: '#3F3A36',
        secondary: '#8D867F',
        border: '#ECE8E4',
        text: '#2E2E2E',
        cream: '#F0EDE8',
        'warm-white': '#FAFAF8',
        // Dark Mode Luxury Obsidian Palette
        'dark-bg': '#100E0D',
        'dark-surface': '#191615',
        'dark-card': '#221F1C',
        'dark-border': '#2E2925',
        'dark-text': '#F5F2EB',
        'dark-muted': '#9C948D',
        'dark-gold': '#D4AF37',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        'extra-wide': '0.35em',
      },
    },
  },
  plugins: [],
};
