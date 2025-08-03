// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Instagram menggunakan kombinasi font ini
        instagram: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        // Untuk heading/brand name (mirip Instagram logo)
        "instagram-brand": ["Billabong", "cursive"],
        // Alternatif modern
        "inter-instagram": [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        // Instagram-specific font sizes
        "instagram-xs": ["11px", "13px"],
        "instagram-sm": ["12px", "16px"],
        "instagram-base": ["14px", "18px"],
        "instagram-lg": ["16px", "24px"],
      },
      letterSpacing: {
        instagram: "-0.003em",
      },
      fontWeight: {
        "instagram-light": "300",
        "instagram-normal": "400",
        "instagram-medium": "500",
        "instagram-semibold": "600",
        "instagram-bold": "700",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;

// Jika ingin menggunakan Google Fonts, tambahkan di layout.tsx atau _app.tsx:
/*
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Kemudian di className: `${inter.variable} font-inter-instagram`
*/
