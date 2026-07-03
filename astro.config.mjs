import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(fileURLToPath(import.meta.url));

/** 归一化子路径：必须以 / 开头；非根路径时以 / 结尾 */
function normalizeBasePath(raw) {
  const value = (raw ?? '/images/').trim();
  if (!value || value === '/') return '/';
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

const base = normalizeBasePath(process.env.BASE_PATH);

export default defineConfig({
  base,
  integrations: [react(), tailwind()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(root, './src'),
      },
    },
  },
});
