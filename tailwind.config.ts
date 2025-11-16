import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#020617",
          900: "#050816",
          800: "#0b1020",
        },
      },
      boxShadow: {
        neon: "0 20px 60px rgba(79, 70, 229, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
