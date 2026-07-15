/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#050816',
          800: '#0B1120',
          700: '#111827',
          600: '#1E293B',
          500: '#334155',
        },
        accent: {
          cyan: '#22D3EE',
          violet: '#8B5CF6',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['1.875rem', { lineHeight: '1.3' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.15)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'elevated': '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 27% 37%, #0e2a3f 0, transparent 50%), radial-gradient(at 97% 21%, #1a1040 0, transparent 50%), radial-gradient(at 52% 99%, #0a1628 0, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beam': 'beam 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        beam: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
