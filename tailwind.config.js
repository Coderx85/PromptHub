/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF5722",
        gold: {
          500: "#FFD700",
        },
      },
    },
  },
  daisyui: {
    themes: ["night"],
  },
  plugins: [require("daisyui")],
};
