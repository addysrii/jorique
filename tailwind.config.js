/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // JORIQUE Official 60-25-10-5 Brand Palette
        'warm-ivory': '#F5EDE3',  // 60% Dominant Base / Primary Background
        // JORIQUE Specification Colors
        'brand-beige': '#F5EDE3',
        'brand-ivory': '#FCFAF7',
        'brand-gold': '#C6A96B',
        'brand-black': '#1A1A1A',
        'brand-stone': '#8A847D',

        // Specific Collection Colors
        'collection-essential': '#7A8B72',
        'collection-signature': '#243B64',
        'collection-luxe': '#641F2D',
        'collection-souvenir': '#B9787D',
        'collection-hospitality': '#4B5563',

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
        'dark-bg': '#14100D',
        'dark-surface': '#1C1613',
        'dark-card': '#251E19',
        'dark-border': '#332922',
        'dark-text': '#FCFAF7',
        'dark-muted': '#8A847D',
        'dark-gold': '#C6A96B',
        'dark-teal': '#0E7A7D',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        times: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        logo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mainlogo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
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
