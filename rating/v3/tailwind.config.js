/** @type {import('tailwindcss').Config} */


const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'mono': ['Source Code Pro', ...defaultTheme.fontFamily.mono]
      },
      colors:{
        citd:{
          purple: '#9157D3',
          cyan: '#53FEDF'
        }
      },
      backgroundImage: {
        "content-image":"url('/citd-bg.png')",
      },
      borderWidth:{
        "basic": "0.1rem"
      }
    },
  },
  plugins: [],
};