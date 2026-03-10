/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1e293b',    // slate-800
        'secondary-accent': '#0d9488',// teal-600
        'highlight-action': '#f97316',// orange-500
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}
