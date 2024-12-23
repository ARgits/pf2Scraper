import { useContentStore } from '@/stores/content'
import type { DataRoutes, generalContent } from '@types'
import { capitalize } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { pg as dbObject } from "@/main"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { path: '/backgrounds' }
    },
    {
      path: '/ancestries',
      name: 'ancestry',
      component: () => import('@views/ContentView.vue'),
    },
    {
      path: '/feats',
      name: "feat",
      component: () => import('@views/ContentView.vue'),
    },
    {
      path: '/backgrounds',
      name: "background",
      component: () => import('@views/ContentView.vue')
    },
    {
      path: '/spells',
      name: "spell",
      component: () => import('@views/ContentView.vue')
    },
    {
      path: '/actions',
      name: "action",
      component: () => import('@views/ContentView.vue')
    },
    {
      path: '/creatures',
      name: "creature",
      component: () => import('@views/ContentView.vue'),
    },
    {

      path: '/favorites',
      name: 'favorite',

      beforeEnter: async (to, from) => {
        
        const { isDataFetched } = useContentStore()
        const localStorageString = localStorage.getItem('favorites')
        
        const favoriteIds: generalContent["id"][] = localStorageString ? JSON.parse(localStorageString).map(i => typeof i === 'string' ? i : `'${i.id}'`) : []
        
        if (isDataFetched && dbObject && localStorageString && favoriteIds.length) {
          const firstFavoriteDataType = (await dbObject.query<{ data_type: DataRoutes }>(`SELECT data_type FROM content where id in (${favoriteIds}) or ru_id in(${favoriteIds}) group by data_type`)).rows[0]
          
          for (const path of ['feat', 'spell', 'background', 'creature', 'action', 'ancestry'] as DataRoutes[]) {
            if (firstFavoriteDataType.data_type === path && to.name !== `favorite${capitalize(path)}`) {
              return { name: `favorite${capitalize(path)}` }
            }
          }
        }
        else if (to.name !== 'favoriteFeat' && from.name) {
          return { name: 'favoriteFeat' }
        }
      },
      children: [
        // { path: '', alias: 'favoriteFeats', component: () => import('@views/ContentView.vue') },
        { path: 'feats', name: "favoriteFeat", component: () => import('@views/ContentView.vue'), },
        { path: 'spells', name: "favoriteSpell", component: () => import('@views/ContentView.vue'), },
        { path: 'actions', name: "favoriteAction", component: () => import('@views/ContentView.vue'), },
        { path: 'backgrounds', name: "favoriteBackground", component: () => import('@views/ContentView.vue'), },
        { path: 'creatures', name: "favoriteCreature", component: () => import('@views/ContentView.vue'), },
        { path: 'ancestries', name: "favoriteAncestry", component: () => import('@views/ContentView.vue'), },
        // { path: '/favorites/spells', component: () => import('@views/ContentView.vue') }
      ]
    },
    {
      path: '/content/:id',
      name: 'content',
      component: () => import('@views/ItemView.vue')
    }
  ],
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (_, __) => {
  // if(to.name==='favorite'){
  //   if(!(from.name as string).includes('favorite')){
  //     const { isDataFetched } = useContentStore()
  //     const localStorageString = localStorage.getItem('favorites')
  //     
  //     const favoriteIds: generalContent["id"][] = localStorageString ? JSON.parse(localStorageString).map(i => `'${i.id}'`) : []
  //     
  //     if (isDataFetched && dbObject && localStorageString && favoriteIds.length) {
  //       const firstFavoriteDataType = (await dbObject.query<{ data_type: DataRoutes }>(`SELECT data_type FROM content where id in (${favoriteIds}) or ru_id in(${favoriteIds}) group by data_type`)).rows[0]
  //       
  //       for (const path of ['feat', 'spell', 'background', 'creature', 'action', 'ancestry'] as DataRoutes[]) {
  //         if (firstFavoriteDataType.data_type === path && to.name !== `favorite${capitalize(path)}`) {
  //           return { name: `favorite${capitalize(path)}` }
  //         }
  //       }
  //     }
  //   }
  // }
})
export default router
