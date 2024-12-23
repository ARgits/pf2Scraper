<script setup lang="ts">
//pinia
import { storeToRefs } from 'pinia'
//vue-router
import { RouterView, useRouter } from 'vue-router'
//components
import FooterComponent from '@components/layout/FooterComponent.vue'
import HeaderComponent from '@components/layout/header/HeaderComponent.vue'
import ModalWindow from '@components/utility/ModalWindow.vue'
import VercelSpeedInsights from '@/components/utility/VercelSpeedInsights.vue'
import ReloadPrompt from '@/components/utility/ReloadPrompt.vue'
//stores
import { useModalWindows } from '@stores/modalWindows'
import { useContentStore } from '@stores/content'
import gsap from 'gsap'
import {Draggable} from 'gsap/Draggable'
//other
import { devLog, isProd, isMobile } from '@/utils'
gsap.registerPlugin(Draggable) 
const modalStore = useModalWindows()
const contentStore = useContentStore()
const { isDataFetched } = storeToRefs(contentStore)
const { fetchData } = contentStore
useRouter().isReady().then(async () => {
  if (!isDataFetched.value) {
    await fetchData()
    devLog('data fetched')
  }
})
</script>

<template>
  <VercelSpeedInsights v-if="isProd" />
  <HeaderComponent />
  <main :class="{ standalone: $route.path.includes('content') }">
    <RouterView />
  </main>
  <FooterComponent v-if="!isMobile" />
  <Teleport to="body">
    <ModalWindow
      v-for="[key, _] of modalStore.modalData"
      :id="key"
      :key="key"
    />
  </Teleport>
  <ReloadPrompt />
</template>

<style scoped lang="scss">
main {
  flex-basis: 90%;
  display: flex;
  padding: 0 2rem;
  gap: 10px;
  justify-content: center;
  background-color: rgba(grey, .15);
  border: 1px solid transparent;
  border-radius: var(--border-radius);

  &:has(.loading) {
    align-items: center
  }

  &.standalone {
    flex-direction: column;
  }
}

// @media (max-aspect-ratio: 1/1) {
//   main {
//     flex-basis: 95%;
//     position: relative;
//     padding: 0;
//     flex-direction: column;
//     //align-items: stretch;
//     justify-content: space-around;
//     // align-items: flex-start;
//     // justify-items: flex-start;
//     background-color: unset;
//   }
// }</style>
