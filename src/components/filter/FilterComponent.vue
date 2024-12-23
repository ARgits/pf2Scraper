<script setup lang="ts">
import SubFilterComponent from "@components/filter/SubFilterComponent.vue"


import { useContentStore } from "@/stores/content";
import { storeToRefs } from "pinia";
const { currentFilter, routeName } = storeToRefs(useContentStore())
</script>
<template>
  <div class="filter_main">
    <div class="container">
      <div
        v-for="some in currentFilter"
        :key="some.filter_name + routeName"
      >
        <SubFilterComponent :sub-filter="some" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
div.filter_main {
  flex-basis: 30%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 5px;
  flex-shrink: 0;
  border: 1px solid black;
  border-radius: var(--border-radius);

}

.container {
  flex: 1 1 auto;
  height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}



// @media (max-aspect-ratio: 1/1) {
//   div.filter_main {
//     flex: 1 1 auto;
//     height: 0;
//     transition: opacity .5s ease;
//     overflow-y: auto
//   }
// }</style>