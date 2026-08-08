/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A24E",
          light: "#DDBE7A",
          dark: "#A9832F",
        },
        navy: {
          DEFAULT: "#0F2B3D",
          light: "#1B4359",
          dark: "#081B27",
        },
        teal: {
          DEFAULT: "#1A7A6A",
          light: "#279685",
          dark: "#125A4E",
        },
        ink: {
          DEFAULT: "#0F2129",
          muted: "#586A72",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        elevated: "0 20px 40px -20px rgba(15, 43, 61, 0.25)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #DDBE7A 0%, #C9A24E 50%, #A9832F 100%)",
      },
    },
  },
  plugins: [],
};
