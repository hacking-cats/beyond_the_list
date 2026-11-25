// Configuration for the Quasar app (Vue 3 + Quasar v2, Vite). See decision 0001.
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';

export default defineConfig((ctx) => {
  return {
    boot: ['i18n', 'services'],

    css: ['app.css'],

    // No icon or web fonts: the design system has its own SVG icons and falls back to the
    // system font offline. Add 'material-icons' here when a page uses QIcon.
    extras: [],

    build: {
      target: {},

      typescript: {
        strict: true,
        vueShim: true,
      },

      // Hash mode so GitHub Pages never needs a 404 fallback (decision 0001).
      vueRouterMode: 'hash',

      // GitHub Pages serves the site from /<repo>/; the Pages workflow sets PUBLIC_PATH.
      // Android (Capacitor) and local builds keep '/'.
      publicPath: process.env.PUBLIC_PATH || '/',

      // Keep the quotes around attribute values in index.html: some link-preview crawlers
      // (WhatsApp, Messenger) read the og: meta tags with simple parsers.
      htmlMinifyOptions: { removeAttributeQuotes: false },

      // finAInce chat backend (src/adapters/assistant/http.ts), read as import.meta.env.FINAINCE_CHAT_URL.
      // Override with FINAINCE_CHAT_URL=<url>; FINAINCE_CHAT_URL= (empty) uses the offline fake.
      defineEnv: {
        FINAINCE_CHAT_URL: process.env.FINAINCE_CHAT_URL ?? 'https://d114-85-195-234-16.ngrok-free.app/chat',
      },

      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.mode.ssr || ctx.mode.ssg,
            include: [ctx.appPaths.resolve.app('src/i18n')],
          },
        ],
      ],
    },

    devServer: {
      open: false,
    },

    framework: {
      config: {
        // Brand colours from the design system (src/css/tokens.css).
        brand: {
          primary: '#004B5A',
          secondary: '#00373D',
          accent: '#FF5A36',
          dark: '#0E1A1C',
          'dark-page': '#0E1A1C',
          positive: '#1B7F4B',
          negative: '#C0392B',
          info: '#266BC7',
          warning: '#946219',
        },
      },
      lang: 'en-US',
      plugins: [],
    },

    animations: [],

    capacitor: {
      hideSplashscreen: true,
    },
  };
});
