module.exports = {
  purge: [ './src/**/*.{js,jsx,ts,tsx}', './public/index.html' ],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        rotateY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        }
      },
      animation: {
        rotateY: 'rotateY 2s linear',
      }
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus', 'active', 'group-hover'],
      transitionProperty: ['hover', 'focus'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-transforms')({
      '3d': false, // defaults to false
    }),
  ],
}
