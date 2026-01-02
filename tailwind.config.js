// /** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        ring: {
          '0%': { transform: 'rotate(0)' },
          '10%': { transform: 'rotate(15deg)' },
          '20%': { transform: 'rotate(-15deg)' },
          '30%': { transform: 'rotate(10deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(0)' },
        }
      },
      animation: {
        ring: 'ring 2s infinite',
      }
    },
  },
  plugins: [],
}
