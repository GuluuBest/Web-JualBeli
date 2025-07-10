// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // GABUNGKAN SEMUA DI SINI
      colors: {
        primary: "#1A659E",
        secondary: "#2482C5",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        "text-primary": "#212529",
        "text-secondary": "#6C757D",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
