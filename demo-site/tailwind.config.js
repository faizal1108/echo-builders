/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f1f7f3",
          100: "#dcece1",
          200: "#b7d7c1",
          300: "#86b99a",
          400: "#54986f",
          500: "#2d6a4f",
          600: "#245a43",
          700: "#1b4332",
          800: "#163528",
          900: "#10261d",
        },
        soil: {
          400: "#b08968",
          500: "#7f5539",
          600: "#5c3d28",
        },
        wheat: {
          50: "#fbf7ef",
          100: "#f4ead6",
          200: "#e8d4ad",
          400: "#d4a373",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(27, 67, 50, 0.35)",
      },
    },
  },
  plugins: [],
};
