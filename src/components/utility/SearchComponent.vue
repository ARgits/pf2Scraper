<script setup lang="ts">
import { useContentStore } from '@stores/content';
import { usePaginationStore } from '@stores/pagination';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import ItemsCounterComponent from '@components/utility/ItemsCounterComponent.vue';
import ContentViewSettings from './ContentViewSettings.vue'

import CustomInputComponent from './CustomInputComponent.vue';
import { useRoute } from 'vue-router';
import type { DataRoutes } from '@/types';
import { pg as dbObject } from '@/main';
const { searchItem} = storeToRefs(useContentStore())
const { itemsPerPage } = storeToRefs(usePaginationStore())
const route = useRoute()
const hasLevelProperty = ref(false)
watch(route, async () => {
  if (dbObject) {
    hasLevelProperty.value = (await dbObject.query<{ count: number }>(`SELECT count(*) FROM content where data_type=$1 and level is not null`, [route.name as DataRoutes])).rows[0].count > 0
  }
})
function changeSearchItem(e: Event) {
  const eventTarget = e.target as EventTarget & { value?: string }
  if (eventTarget.value === undefined) return
  searchItem.value = eventTarget.value
}
</script>
<template>
  <div class="search">
    <CustomInputComponent
      type="text"
      :on-change-func="changeSearchItem"
      :data-value="searchItem"
      label-text="Поиск по названию (Ru/En)"
    />
    <div>
      <label>Показывать по:
        <select v-model="itemsPerPage">
          <option value="10">
            10
          </option>
          <option value="25">
            25
          </option>
          <option value="50">
            50
          </option>
          <option value="100">
            100
          </option>
        </select>
      </label>
    </div>
    <ItemsCounterComponent />
    <ContentViewSettings />
  </div>
</template>
<style lang="scss" scoped>
.search {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: .5rem;
    border: 1px solid black;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
}

// @media (max-aspect-ratio:1/1) {
//     .search {
//         margin: 0 .5rem 0 3rem;
//     }
// }</style>