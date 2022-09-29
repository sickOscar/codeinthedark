/** @type {import('tailwindcss').Config} */


const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        screengreen:{
          500: '#00ff00'
        }
      }
    },
  },
  plugins: [],
};
