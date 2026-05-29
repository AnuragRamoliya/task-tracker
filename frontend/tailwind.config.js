/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        mist: "#F6F8FA",
        line: "#DCE3EA",
        brand: "#0F766E",
        coral: "#E76F51"
      }
    }
  },
  plugins: []
};
