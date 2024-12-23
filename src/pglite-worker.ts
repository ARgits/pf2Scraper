import {  PGlite } from "@electric-sql/pglite"
import { worker } from "@electric-sql/pglite/worker"
import { fetchDB } from "./pglite-init"
import { devLog } from '@/utils.ts'

worker({
  async init(options) {
    if (options.meta.isIDB) {
      devLog('pglite worker init: idb exist')
      if (options.meta.isVersionCorrect !== 0) {
        devLog('pglite worker init: wrong version, fetching new version')
        indexedDB.deleteDatabase('/pglite/contentDB')
        return fetchDB()
      }

      return new PGlite({ dataDir: 'idb://contentDB', relaxedDurability: true, })
    } else {
      devLog('pglite worker init: no idb, fetching')
      return fetchDB()
    }
  }
}).then(r =>devLog('pglite worker init:finished'))