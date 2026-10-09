/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        surface: {
          DEFAULT: "#121A2B",
          hover: "#1B263B",
          border: "#1E2A40",
          card: "#152033"
        },
        cyan: {
          accent: "#37D7F2",
          glow: "rgba(55, 215, 242, 0.15)",
          hover: "#22C5E2"
        },
        verdict: {
          threat: "#EF4444",
          highRisk: "#F97316",
          suspicious: "#F59E0B",
          safe: "#10B981",
          inconclusive: "#6B7280"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      }
    }
  },
  plugins: []
};
