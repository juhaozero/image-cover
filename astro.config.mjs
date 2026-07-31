import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

const root = path.dirname(fileURLToPath(import.meta.url));


// base传入的路径必须以 / 开头，非根路径时以 / 结尾
function normalizeBasePath(raw) {
  const value = (raw ?? '/').trim();
  if (!value || value === '/') return '/';
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

// CI / Pages 可通过环境变量覆盖；本地默认读 .env
const base = normalizeBasePath(process.env.BASE_PATH ?? env.BASE_PATH);

export default defineConfig({
  base,
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      }
    },
     //  开发端口号
     server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 4173,
    },
 
  }
});