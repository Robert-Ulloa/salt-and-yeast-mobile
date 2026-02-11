/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF7ED',
        cocoa: '#4A2F1D',
        crust: '#D8A25E',
        charcoal: '#3C3C3C',
        gold: '#C9A84C',
        berry: '#8A1C4A',
      },
    },
  },
  plugins: [],
};
