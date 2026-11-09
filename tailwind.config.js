/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        cyber: {
          dark: '#070f1e',
          card: '#0d1a2d',
          cardHover: '#13243c',
          border: 'rgba(56, 189, 248, 0.18)',
          glow: '#00d2ff',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"IBM Plex Sans"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Noto Sans Bengali"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.98)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
