import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        surface: {
          DEFAULT: "rgb(var(--bg-surface) / <alpha-value>)",
          secondary: "rgb(var(--bg-secondary) / <alpha-value>)",
          subtle: "rgb(var(--bg-subtle) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border-color) / var(--border-alpha))",
          subtle: "rgb(var(--border-color) / 0.04)",
          strong: "rgb(var(--border-color) / 0.2)",
        },
        brand: {
          DEFAULT: "rgb(var(--brand-primary) / <alpha-value>)",
          light: "rgb(var(--brand-light) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          accentLight: "rgb(var(--brand-accent-light) / <alpha-value>)",
        },
        status: {
          success: "#1F7A4D",
          successBg: "var(--status-success-bg)",
          warning: "#B25E09",
          warningBg: "var(--status-warning-bg)",
          error: "#C02626",
          errorBg: "var(--status-error-bg)",
        },
      },
      borderRadius: {
        container: "18px",
        control: "12px",
        dialog: "22px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
      },
    },
  },
  plugins: [],
};

export default config;
