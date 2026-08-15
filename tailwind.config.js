/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10262E',
        'ink-soft': '#48626B',
        paper: '#F1F5F4',
        petrol: '#1B4B57',
        'petrol-mid': '#2E6B7A',
        'petrol-tint': '#DCE8E9',
        tie: '#A63D6B',
        'tie-tint': '#F6E4EE',
        sand: '#E4D9C6',
        line: '#C9D8D9',
      },
      fontFamily: {
        display: ['"Frank Ruhl Libre"', 'Georgia', 'serif'],
        body: ['Assistant', 'Arial', 'sans-serif'],
        util: ['"IBM Plex Sans Hebrew"', 'Arial', 'sans-serif'],
      },
      maxWidth: { prose: '66ch' },
    },
  },
  plugins: [],
};
