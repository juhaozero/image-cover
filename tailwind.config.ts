import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        studio: {
          bg: '#FAF7F4',
          surface: '#FFFFFF',
          muted: '#F3EFEB',
          canvas: '#1C1917',
          'canvas-inner': '#292524',
          border: '#E8E2DC',
          'border-strong': '#D6CEC6',
        },
        accent: {
          DEFAULT: '#E11D48',
          hover: '#BE123C',
          soft: '#FFF1F2',
          muted: '#FECDD3',
        },
        ink: {
          DEFAULT: '#1C1917',
          secondary: '#57534E',
          muted: '#A8A29E',
          faint: '#D6D3D1',
        },
      },
      boxShadow: {
        panel: '0 1px 3px rgba(28,25,23,0.06), 0 4px 12px rgba(28,25,23,0.04)',
        canvas: '0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)',
        dock: '0 -4px 24px rgba(28,25,23,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
