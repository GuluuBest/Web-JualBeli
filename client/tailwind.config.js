// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ... warna dari atas ... */
      },
      fontFamily: {
        // Atur font 'sans' menjadi Poppins
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#1A659E", // Biru khas Itemku
        secondary: "#2482C5",
        background: "#F3F4F6", // Abu-abu muda untuk background
        surface: "#FFFFFF", // Putih untuk kartu/permukaan
        "text-primary": "#212529",
        "text-secondary": "#6C757D",
      },
    },
  },
  plugins: [],
};
