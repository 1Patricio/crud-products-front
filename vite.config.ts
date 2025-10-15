import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    }),
    {
      name: 'copy-redirects',
      closeBundle() {
        copyFileSync('_redirects', 'dist/_redirects')
      }
    }
  ]
})
