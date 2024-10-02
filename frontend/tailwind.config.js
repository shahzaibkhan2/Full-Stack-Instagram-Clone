/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#ac903d",
        hoverBtn: "#9f863d",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
