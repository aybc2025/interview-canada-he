import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base must match the GitHub Pages path. If this ever moves to a custom
// domain, change to '/'.
export default defineConfig({
  base: '/interview-canada-he/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/*.woff2', 'favicon.svg'],
      manifest: {
        name: 'ראיון בקנדה',
        short_name: 'ראיון בקנדה',
        description: 'מדריך לראיונות עבודה בשוק העבודה הקנדי',
        lang: 'he',
        dir: 'rtl',
        start_url: '/interview-canada-he/',
        scope: '/interview-canada-he/',
        display: 'standalone',
        background_color: '#F1F5F4',
        theme_color: '#1B4B57',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,docx,pdf}'],
        // The guide is the point of the site, so assets are cache-first and
        // the whole thing works offline after one visit.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 10 } },
          },
        ],
      },
    }),
  ],
});
