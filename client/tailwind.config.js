/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: ['"Inter"', "sans-serif"],
      colors: {
        background: "#f9fafb",
        surface: "#ffffff",
        primary: "#2563eb",
        text: "#111827",
        "text-muted": "#6b7280",
      },
    },
  },
  plugins: [],
};
