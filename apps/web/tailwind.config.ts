import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Black & White Palette
        black: {
          DEFAULT: "#000000",
          pure: "#000000",
        },
        white: {
          DEFAULT: "#FFFFFF",
          pure: "#FFFFFF",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          800: "#1F1F1F",
          900: "#0A0A0A",
        },
        // Accent Colors (Minimal use)
        accent: {
          blue: "#3B82F6",
          violet: "#8B5CF6",
          red: "#EF4444",
        },
        // Legacy brand colors for compatibility
        brand: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          400: "#3B82F6",
          500: "#3B82F6",
          800: "#1F1F1F",
          900: "#0A0A0A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        heading: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      fontSize: {
        // Typography Scale
        'hero': ['72px', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.02em' }],
        'h1': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.005em' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      spacing: {
        // 8px Grid System
        'micro': '4px',
        'tiny': '8px',
        'hero': '128px',
      },
      maxWidth: {
        'content': '1200px',
        'narrow': '800px',
        'form': '600px',
      },
      borderRadius: {
        'card': '12px',
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        glow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        'card-hover': "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      backdropBlur: {
        'nav': '12px',
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"), 
    require("@tailwindcss/typography"), 
    require("tailwindcss-animate")
  ]
};

export default config;

