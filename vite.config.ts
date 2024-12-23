import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'
// import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(() => {

    return {
        build: {
            target: "esnext"
        },
        optimizeDeps: {
            exclude: ['@electric-sql/pglite']
        },
        plugins: [
            vue(),
            vueJsx(),
            VitePWA({
                // registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,svg,tar.gz,wasm,data, jpg}', "*.*"],
                    maximumFileSizeToCacheInBytes: 40000000
                },
                devOptions: {
                    enabled: true
                },
                manifest: {
                    name: "Pathfinder Second Edition Russian Database",
                    short_name: "Pf2eRuDB",
                    theme_color: "#FFFFFF",
                    icons: [{
                        src: "logo.svg",
                        sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
                        type: "image/svg+xml",
                        purpose: "any"
                    }]
                }
            })
            // VueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
                '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
                '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
                '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
                '@data': fileURLToPath(new URL('./src/data', import.meta.url))
            }
        },
        worker: {
            format: "es"
        }
    }
})
