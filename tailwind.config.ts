import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F7",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#FAFAFA",
          subtle: "#F0F0F2",
        },
        foreground: {
          DEFAULT: "#111111",
          secondary: "#6E6E73",
          muted: "#86868B",
        },
        border: {
          DEFAULT: "rgba(0, 0, 0, 0.08)",
          subtle: "rgba(0, 0, 0, 0.04)",
          strong: "rgba(0, 0, 0, 0.16)",
        },
        brand: {
          DEFAULT: "#1E3A34",
          light: "#EAEFEA",
          hover: "#162B27",
          accent: "#C88A35",
          accentLight: "#F8F1E7",
        },
        status: {
          success: "#1F7A4D",
          successBg: "#EDF7F1",
          warning: "#B25E09",
          warningBg: "#FEF7EC",
          error: "#C02626",
          errorBg: "#FEF2F2",
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
