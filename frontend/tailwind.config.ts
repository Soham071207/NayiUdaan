import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        outfit:  ["'Outfit'",           "system-ui", "sans-serif"],
      },
      colors: {
        green: {
          primary:   "#5F8D4E",
          secondary: "#7FB77E",
          accent:    "#DCEFD8",
          bg:        "#F5FAF4",
          dark:      "#3D6B33",
          card:      "#FFFFFF",
        },
        brand: {
          primary:   "#7C3AED",
          secondary: "#06B6D4",
          success:   "#10B981",
        },
        surface: {
          DEFAULT: "#111127",
          2: "#1A1A35",
          3: "#0D0D22",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "green-sm":  "0 2px 16px rgba(95,141,78,0.08)",
        "green-md":  "0 8px 32px rgba(95,141,78,0.12)",
        "green-lg":  "0 16px 48px rgba(95,141,78,0.18)",
        "glow-violet":"0 0 30px rgba(124,58,237,0.4),0 0 60px rgba(124,58,237,0.15)",
        "glow-cyan":  "0 0 30px rgba(6,182,212,0.4),0 0 60px rgba(6,182,212,0.15)",
      },
      animation: {
        "float":     "float 6s ease-in-out infinite",
        "leaf-sway": "leafSway 4s ease-in-out infinite",
        "shimmer":   "shimmer 1.8s infinite",
        "glow":      "glowPulse 2.5s ease-in-out infinite alternate",
        "fade-up":   "fadeUp 0.6s ease-out",
        "pulse-slow":"pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        float:      { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-10px)" } },
        leafSway:   { "0%,100%": { transform:"rotate(-5deg)" },"50%": { transform:"rotate(5deg)" } },
        shimmer:    { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
        glowPulse:  { "from": { boxShadow:"0 0 20px rgba(124,58,237,0.3)" }, "to": { boxShadow:"0 0 50px rgba(124,58,237,0.7)" } },
        fadeUp:     { "from": { opacity:"0", transform:"translateY(24px)" }, "to": { opacity:"1", transform:"translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
