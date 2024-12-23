<script setup lang="ts">
import PaginationComponent from "@components/utility/PaginationComponent.vue";
import SearchComponent from '@components/utility/SearchComponent.vue';
import ContentContainer from '@components/content/ContentContainer.vue';
import { isMobile } from '@/utils';
</script>
<template>
  <div class="main">
    <SearchComponent v-if="!isMobile" />
    <ContentContainer class="content_group" />
    <PaginationComponent />
  </div>
</template>
<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  flex-basis: 70%;
  gap: 10px;
}


.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  position: relative;
}



.loading {
  align-self: center;
}

// @media (max-aspect-ratio: 1/1) {

//   div.main {
//     flex-basis: 100%;
//     //position: absolute;
//     width: calc(100% - 0rem);
//     height: 100%;
//     transition: opacity .5s ease;

//     &.hidden {
//       flex-basis: 0;
//       // display: none;
//       z-index: -1;
//       opacity: 0;
//     }
//   }

//   // div.content_group {
//   //   margin: 0 .5rem
//   // }
// }</style>