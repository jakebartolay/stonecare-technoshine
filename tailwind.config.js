/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#080808',
        card: '#ffffff',
        'muted-foreground': '#525252',
        primary: '#ff6b00',
        'primary-foreground': '#ffffff',
        border: '#e5e5e5',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        // display: ['Poppins', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        hero: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
