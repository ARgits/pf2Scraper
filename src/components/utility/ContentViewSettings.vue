<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTable, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '@/stores/viewStore';
import { storeToRefs } from 'pinia';
import TableViewColumnSettings from './TableViewColumnSettings.vue';

const viewStore = useViewStore()
const { setViewType, } = viewStore


const { viewType } = storeToRefs(viewStore)

</script>
<template>
  <div class="flex">
    <button @click="() => setViewType()">
      <FontAwesomeIcon
        v-if="viewType === 'table'"
        :icon="faTable"
        size="2x"
      />
      <FontAwesomeIcon
        v-else
        :icon="faTableList"
        size="2x"
      />
    </button>
  </div>
  <TableViewColumnSettings />
</template>
<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 10px
}
</style>