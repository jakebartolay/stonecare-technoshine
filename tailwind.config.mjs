function loadHeroUITheme() {
  try {
    return require('@heroui/theme');
  } catch {
    return require('./node_modules/@heroui/react/node_modules/@heroui/theme');
  }
}

const { heroui } = loadHeroUITheme();

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/node_modules/@heroui/toast/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#080808',
        card: '#f5f5f5',
        primary: '#ff6b00',
        'primary-foreground': '#ffffff',
        border: '#d1d1d1',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        hero: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    heroui({
      themes: {
        light: {
          colors: {
            primary: '#ff6b00',
          },
        },
      },
    }),
  ],
};
