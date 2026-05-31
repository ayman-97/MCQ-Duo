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
        dark: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        neon: {
          green: "#10B981",
          pink: "#EC4899",
          blue: "#3B82F6",
          purple: "#A855F7",
          cyan: "#06B6D4",
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shake: "shake 0.4s ease-in-out",
        float: "float 3s ease-in-out infinite",
        slideUp: "slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
    },
  },
  plugins: [],
};
