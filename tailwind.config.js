/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'text-one': '#55585b',
        'primary': '#075985',
      }
    },
  },
  plugins: [],
}

