import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node';
export default defineConfig({
    output: 'server',
    adapter: node({
      mode: 'standalone',
      output: 'server',
    }),
    vite: {
        plugins: [tailwindcss()],
      server: {
        watch: {
          ignored: ['**/*.json'],
        },
      },
    },
  });
  