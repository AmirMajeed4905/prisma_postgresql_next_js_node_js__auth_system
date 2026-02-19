import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f3d0fe",
          300: "#e9a8fc",
          400: "#d946ef",
          500: "#c026d3",
          600: "#a21caf",
          700: "#86198f",
          800: "#701a75",
          900: "#4a044e",
        },
      },
      backgroundImage: {
        "mesh-1": "radial-gradient(at 40% 20%, #f472b6 0px, transparent 50%), radial-gradient(at 80% 0%, #818cf8 0px, transparent 50%), radial-gradient(at 0% 50%, #fb923c 0px, transparent 50%), radial-gradient(at 80% 50%, #34d399 0px, transparent 50%), radial-gradient(at 0% 100%, #f472b6 0px, transparent 50%)",
        "mesh-2": "radial-gradient(at 21% 33%, #fb923c 0px, transparent 50%), radial-gradient(at 79% 18%, #818cf8 0px, transparent 50%), radial-gradient(at 50% 80%, #f472b6 0px, transparent 50%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
