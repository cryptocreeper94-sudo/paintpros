/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(85, 20%, 35%)",
          foreground: "hsl(45, 30%, 95%)",
        },
        accent: {
          DEFAULT: "hsl(45, 90%, 55%)",
          foreground: "hsl(85, 20%, 15%)",
        },
        background: {
          DEFAULT: "hsl(85, 15%, 8%)",
          light: "hsl(45, 30%, 97%)",
        },
        foreground: {
          DEFAULT: "hsl(45, 30%, 95%)",
          light: "hsl(85, 20%, 15%)",
        },
        muted: {
          DEFAULT: "hsl(85, 10%, 20%)",
          foreground: "hsl(45, 20%, 70%)",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  plugins: [],
};
