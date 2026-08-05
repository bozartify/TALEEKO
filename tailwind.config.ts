import type { Config } from 'tailwindcss'

/**
 * TeachWeaver — "Reading Room" design system.
 * Warm charcoal ground, ink-and-paper text, a single marigold accent
 * (the teacher's highlighter), with sage and clay as calm supporting hues.
 * Legacy token names (electric/neon) are preserved but remapped into the
 * warm palette so every existing page recolors coherently.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm charcoal ramp — 950 is the darkest ground, 50 the lightest paper.
        // 300/400/500 are the text tiers and are tuned so every one of them
        // clears WCAG AA (4.5:1) on all three grounds, including the raised
        // panel. The original ramp bottomed out at 2.6:1, which failed for
        // the ~220 places 500 is used as meta text.
        surface: {
          DEFAULT: '#17140f',
          50: '#f7f1e8',
          100: '#ece3d6',
          200: '#ddd0bd',
          300: '#c2b49e', //  7.64:1 on raised
          400: '#ab9d86', //  5.85:1 on raised
          500: '#968877', //  4.51:1 on raised — the floor for readable text
          550: '#6f6150', //  decorative only: rules, disabled glyphs, never text
          600: '#4d4234',
          700: '#362e23',
          800: '#29231b',
          900: '#1e1a14',
          950: '#17140f',
        },
        // Marigold — the primary accent. A highlighter, not a neon.
        accent: {
          DEFAULT: '#dd9a33',
          50: '#fdf6e7',
          100: '#fae9c4',
          200: '#f5d698',
          300: '#efc06b',
          400: '#e8ad4b',
          500: '#dd9a33',
          600: '#bc7d24',
          700: '#955f1e',
          800: '#6f461b',
          900: '#4d3115',
        },
        // Legacy "electric" remapped to a calm sage.
        electric: {
          DEFAULT: '#829c6e',
          50: '#eef2ea',
          100: '#dbe4d2',
          200: '#bccbac',
          300: '#9cb389',
          400: '#829c6e',
          500: '#6b8557',
          600: '#55703f',
        },
        // Legacy "neon" remapped to a warm clay.
        neon: {
          DEFAULT: '#c67954',
          50: '#f8ece5',
          100: '#f0d4c5',
          200: '#e2b39c',
          300: '#d49274',
          400: '#c67954',
          500: '#b0623f',
          600: '#914d30',
        },
        success: {
          DEFAULT: '#86b06a',
          50: '#eef4e7',
          100: '#d8e6c9',
          400: '#86b06a',
          500: '#6f9a54',
          600: '#587f41',
        },
        warning: {
          DEFAULT: '#e6b34d',
          50: '#fdf6e7',
          100: '#fae9c4',
          400: '#e6b34d',
          500: '#d1962f',
          600: '#b0791f',
        },
        danger: {
          DEFAULT: '#d97b63',
          50: '#f9ece8',
          100: '#f2d3ca',
          400: '#d97b63',
          500: '#c25a44',
          600: '#a3452f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        // Warm, soft elevation — no glow, no glass halo.
        'glass': '0 1px 2px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(240,220,190,0.05)',
        'glass-hover': '0 6px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(240,220,190,0.08)',
        'glass-lg': '0 16px 44px rgba(0,0,0,0.5)',
        'glow-accent': '0 4px 18px rgba(221,154,51,0.22)',
        'glow-accent-sm': '0 2px 10px rgba(221,154,51,0.16)',
        'glow-electric': '0 4px 18px rgba(130,156,110,0.18)',
        'glow-neon': '0 4px 18px rgba(198,121,84,0.18)',
        'inner-light': 'inset 0 1px 0 rgba(240,220,190,0.05)',
        'elevation-1': '0 1px 2px rgba(0,0,0,0.35)',
        'elevation-2': '0 4px 12px rgba(0,0,0,0.4)',
        'elevation-3': '0 12px 36px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config
