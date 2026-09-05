/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // JORIQUE Official 60-25-10-5 Brand Palette
        'warm-ivory': '#F5EDE3',  // 60% Dominant Base / Primary Background
        'brand-ivory': '#F5EDE3',
        'brand-beige': '#F5EDE3',
        'brand-black': '#1A1A1A',  // 25% Structure, Typography & Contrasts
        'brand-gold': '#C6A96B',   // 10% Luxury Accents, Borders & Details
        'deep-teal': '#0B5F61',    // 5% Special Elements & Standout Moments
        'brand-teal': '#0B5F61',
        'brand-stone': '#8A847D',

        background: '#F5EDE3',
        primary: '#1A1A1A',
        secondary: '#8A847D',
        gold: '#C6A96B',
        teal: '#0B5F61',
        border: '#E8DFD3',
        text: '#1A1A1A',
        cream: '#F5EDE3',
        ivory: '#FCFAF7',
        'warm-white': '#FAF7F2',

        // Dark Mode Luxury Palette
        'dark-bg': '#12100E',
        'dark-surface': '#1A1816',
        'dark-card': '#23201D',
        'dark-border': '#2E2925',
        'dark-text': '#FCFAF7',
        'dark-muted': '#8A847D',
        'dark-gold': '#C6A96B',
        'dark-teal': '#0E7A7D',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        logo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        logo: '0.20em',
        widest: '0.25em',
        'extra-wide': '0.35em',
      },
    },
  },
  plugins: [],
};
