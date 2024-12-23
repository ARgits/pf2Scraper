import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { semanticCheck } from './utils'

if (import.meta.env.PROD) {
    const { inject } = await import('@vercel/analytics')
    inject();
}
const DBversion = '1.0.0'
const indexedDbName = '/pglite/contentDB'
const indexedDbExist = (await indexedDB.databases()).find((f) => f.name === indexedDbName)
const localDBVersion = indexedDbExist ? localStorage.getItem('db-version') as `${number}.${number}.${number}` : null
const isVersionCorrect = localDBVersion ? semanticCheck(localDBVersion, DBversion) : 1

export const pg = new PGliteWorker(new Worker(new URL('./pglite-worker.ts', import.meta.url), { type: 'module', }), { meta: { isIDB: !!indexedDbExist, DBversion, isVersionCorrect } })
if (isVersionCorrect !== 0) {
    pg.waitReady.then(() => localStorage.setItem('db-version', DBversion))
}
const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => {
    store.router = markRaw(router)
})
app.use(pinia)
app.use(router)
app.mount('#app')
app.directive('boxShadow',(el, binding)=>{
    console.log(el,binding)
})
