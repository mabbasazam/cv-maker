/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      wordSpacing: {
        tight: "-0.05em", // Adjust this value to reduce spacing
      },
    },
  },
  plugins: [],
  experimental: {
    colorFormat: "rgb",
  },
};
