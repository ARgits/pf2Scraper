<script setup lang="ts">
import { useFavoritesStore } from '@stores/favorites';
import type { generalContent } from '@types';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
defineProps<{ id: generalContent["id"] }>()
const { hasItemById, addRemoveItem } = useFavoritesStore()
</script>
<template>
  <button
    class="button"
    aria-label="add/remove to favorites"
    @click="addRemoveItem(id)"
  >
    <FontAwesomeIcon :icon="hasItemById(id) ? faBookmark : emptyBookmark" />
  </button>
</template>
<style lang="scss" scoped>
.button {
    display: inline;
    padding: 0;
    float: right;
    border: 0;
    background: none;
    margin: 5px;
}
</style>