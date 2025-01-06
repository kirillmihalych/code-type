/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        golos: ["Golos text", "serif"],
        "jet-brains": ["JetBrains Mono", "serif"],
      },
      animation: {
        blink: "blink 1s linear infinite",
      },
      keyframes: {
        blink: {
          "0, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        helper: "var(--helper)",
        text: "var(--text)",
        bg: "var(--bg)",
      },
    },
  },
  plugins: [],
};
