module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: "#ffcd3c",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/ui")],
};