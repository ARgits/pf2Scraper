import { IdbFs, PGlite } from '@electric-sql/pglite'

export async function getPG(options:{meta:{isIDB:boolean, isVersionCorrect:number}})
{if (options.meta.isIDB) {
    if (options.meta.isVersionCorrect !== 0) {

      indexedDB.deleteDatabase('/pglite/contentDB')
      
      return await fetchDB()
    }
    
    return new PGlite({ dataDir: 'idb://contentDB', relaxedDurability: true, })
  } else {
    
    return await fetchDB()
  }}
export async function fetchDB() {
const res = await fetch('/db.tar.gz')

if (res.ok) {
  return await PGlite.create({
    loadDataDir: await res.blob(),
    fs: new IdbFs('contentDB'),
    relaxedDurability: true,
  })
}
return await PGlite.create()
}