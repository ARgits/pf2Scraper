<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { usePaginationStore } from '@stores/pagination';

const paginationStore = usePaginationStore()
</script>
<template>
  <div
    v-if="paginationStore.numOfPages > 1"
    class="pagination"
  >
    <button
      class="button"
      aria-label="previous page"
      :class="{ hidden: paginationStore.currentPage === 0 }"
      @click="paginationStore.changePage(paginationStore.currentPage - 1)"
    >
      <FontAwesomeIcon :icon="faArrowLeft" />
    </button>
    <div
      v-for="(page, index) of paginationStore.pages"
      :key="index"
    >
      <button
        v-if="page !== '...'"
        class="button"
        :aria-label="`move to page number ${page}`"
        :class="{ active: paginationStore.currentPage === page }"
        @click="paginationStore.changePage(page)"
      >
        {{ page + 1 }}
      </button>
      <span v-else>{{ page }}</span>
    </div>
    <button
      class="button"
      aria-label="next page"
      :class="{ hidden: paginationStore.currentPage === paginationStore.numOfPages - 1 }"
      @click="paginationStore.changePage(paginationStore.currentPage + 1)"
    >
      <FontAwesomeIcon :icon="faArrowRight" />
    </button>
  </div>
</template>
<style lang="scss">
.pagination {
    flex-basis: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .5rem .25rem;

    & .button {
        height: 1.5rem;
        aspect-ratio: 1/1;
        border-radius: var(--border-radius);
        background-color: rgba(grey, .1);
        transition: all .5s ease;

        &.active {
            background-color: green;
        }

        &.hidden {
            opacity: .5;
        }

        &:active {
            background-color: grey;
        }
    }
}
</style>