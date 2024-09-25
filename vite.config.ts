import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()]
    }),
    VueI18nPlugin({
      // runtimeOnly: false,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
