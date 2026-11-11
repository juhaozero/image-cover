import type { Config } from 'tailwindcss';

const rgb = (token: string) => `rgb(var(--${token}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans SC', 'sans-serif'],
        display: ['Playfair Display', 'Noto Serif SC', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        studio: {
          bg: rgb('studio-bg'),
          surface: rgb('studio-surface'),
          muted: rgb('studio-muted'),
          border: rgb('studio-border'),
          'border-strong': rgb('studio-border-strong'),
        },
        accent: {
          DEFAULT: rgb('studio-accent'),
          hover: rgb('studio-accent-hover'),
          soft: rgb('studio-accent-soft'),
          muted: rgb('studio-accent-muted'),
        },
        ink: {
          DEFAULT: rgb('studio-ink'),
          secondary: rgb('studio-ink-secondary'),
          muted: rgb('studio-ink-muted'),
          faint: rgb('studio-ink-faint'),
        },
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        canvas: 'var(--shadow-canvas)',
        dock: 'var(--shadow-dock)',
      },
    },
  },
  plugins: [],
} satisfies Config;
