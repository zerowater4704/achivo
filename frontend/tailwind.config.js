/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zen: ['"Zen Maru Gothic"', "sans-serif"],
        sans: ['"M PLUS Rounded 1c"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
