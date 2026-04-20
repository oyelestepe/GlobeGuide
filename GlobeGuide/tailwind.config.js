/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        neon: {
          green: '#22d35e',
          blue: '#38bdf8',
          purple: '#a78bfa',
          coral: '#fb923c',
          yellow: '#fbbf24',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'bounce-light': 'bounceLight 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 94, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 94, 0.7)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'card-gradient': 'linear-gradient(135deg, #1e293b, #0f172a)',
        'neon-border': 'linear-gradient(135deg, #22d35e, #38bdf8)',
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(34, 211, 94, 0.4)',
        'neon-blue': '0 0 20px rgba(56, 189, 248, 0.4)',
        'neon-purple': '0 0 20px rgba(167, 139, 250, 0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
