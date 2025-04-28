// postcss.config.js

module.exports = {
    plugins: [
      require('tailwindcss'),   // Ensures Tailwind is processed
      require('autoprefixer'),   // Adds vendor prefixes automatically
    ],
  }
  