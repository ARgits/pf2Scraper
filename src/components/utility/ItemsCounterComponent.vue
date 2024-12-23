<script setup lang="ts">
import { useContentStore } from '@/stores/content';
// import { useAnimate } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { reactive, watch } from 'vue';
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import gsap from 'gsap';
// import { useRoute } from 'vue-router';
// import type { DataRoutes } from '@/types';
// const route = useRoute()
// const data_type =computed(()=> (route.name as string).includes('favorite') ? (route.name as string).replace('favorite', '').toLocaleLowerCase()as DataRoutes : route.name as DataRoutes)
const { numOfItems } = storeToRefs(useContentStore())
const tweenNumber = reactive({ number: numOfItems.value })
// watch(numOfItems,(n)=>tweenNumber.number=n)
watch(numOfItems, (n) => gsap.to(tweenNumber, { duration: .5, number: Number(n) || 0 }))
</script>
<template>
  <div class="main">
    <span>Найдено: {{ tweenNumber.number.toFixed(0) }} </span>
    <!-- <FontAwesomeIcon v-if="!isFetchedByKey[data_type]"
                         :icon="faSpinner"
                         spin /> -->
  </div>
</template>
<style scoped lang="scss">
.main {
    --fa-animation-iteration-count: infinite;
}
</style>