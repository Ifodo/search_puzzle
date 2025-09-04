/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#025940',
          dark: '#014233',
          mint: '#B6E3C3',
          sand: '#F3EFE6',
          charcoal: '#1F2937'
        }
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.08)'
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        250: '250ms'
      }
    }
  },
  plugins: []
}; 