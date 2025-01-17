/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        golos: ["Golos text", "serif"],
        "jet-brains": ["JetBrains Mono", "serif"],
      },
      fontSize: {
        smallest: "0.5rem",
      },
      animation: {
        blink: "blink 1s linear infinite",
        colorChange: "colorChange 3s linear infinite",
      },
      keyframes: {
        blink: {
          "0, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        colorChange: {
          "0%": { color: "var(--animation-color-1)" },
          "50%": { color: "var(--animation-color-2)" },
          "100%": { color: "var(--animation-color-1)" },
        },
      },
      colors: {
        primary: "var(--primary)",
        background: "var(--background)",
        helper: "var(--helper)",
        text: "var(--text)",
        bg: "var(--bg)",
        error: "var(--error)",
        caret: "var(--caret)",
        sub: "var(--sub)",
      },
    },
  },
  plugins: [],
};
