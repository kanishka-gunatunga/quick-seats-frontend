/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D3192",
        secondary: "#27337C",
        white: "#FFFFFF",
        gray: {
          100: "#F3F4F6",
          300: "#D1D5DB",
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'clash-grotesk': ['Clash Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}; 