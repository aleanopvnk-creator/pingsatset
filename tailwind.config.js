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
        cyber: {
          dark: '#0a0d14',
          card: '#121824',
          accent: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          pink: '#ec4899',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}