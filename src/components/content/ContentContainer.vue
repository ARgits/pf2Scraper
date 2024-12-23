<script setup lang="ts">
import ContentItem from './ContentItem.vue';
import ContentContainerTableView from './ContentContainerTableView.vue'
import { storeToRefs } from 'pinia';
import { useContentStore } from '@/stores/content';
import { useViewStore } from '@/stores/viewStore';
import ContainerFadeSlideTransition from "@components/transitions/ContainerFadeSlideTransition.vue"
const { numOfItems, currentContent } = storeToRefs(useContentStore())
const { viewType } = storeToRefs(useViewStore())
</script>
<template>
  <div v-if="numOfItems">
    <template v-if="viewType === 'list'">
      <ContainerFadeSlideTransition>
        <ContentItem
          v-for="content in currentContent"
          :key="content.id"
          :content="content"
        />
      </ContainerFadeSlideTransition>
    </template>
    <template v-else-if="viewType === 'table'">
      <ContentContainerTableView />
    </template>
  </div>
  <div
    v-else
    class="empty"
  >
    <span>Пусто :(
    </span>
  </div>
</template>
<style scoped lang="scss">
.empty {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 200%;
}

.content_group {
  // display: flex;
  display: grid;
  grid-template-columns: repeat(var(--numOfColumns, 1), 1fr);
  grid-template-rows: auto;
  gap: 10px;
  flex: 1 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  height: 0;
  position: relative;
}
</style>