/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9945FF',
        secondary: '#14F195',
        dark: '#0f0f0f',
        card: '#1a1a2e',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(153, 69, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
