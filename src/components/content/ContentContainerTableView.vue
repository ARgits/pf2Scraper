<script setup lang="ts">
import { capitalize, computed} from 'vue';
import { storeToRefs } from 'pinia';
import { useContentStore } from '@/stores/content';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {  faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '@/stores/viewStore';
import ContentItemTableView from "./ContentItemTablewView.vue"
// const viewStore = useViewStore()
const { currentContent } = storeToRefs(useContentStore())
const { currentColumns, currentNumOfColumns } = storeToRefs(useViewStore())
const shownColumns = computed(()=>currentColumns.value.filter((v)=>v.isShown))
// const currentColumns = computed(() => allColumns.value![routeName.value])

</script>
<template>
  <div class="table">
    <div
      v-for="(column) in shownColumns"
      :key="column.key"
      class="table_item header"
    >
      <span>
        {{ capitalize(column.name) }}
      </span>
      <FontAwesomeIcon :icon="faEyeSlash" />
    </div>
    <ContentItemTableView
      v-for="(content,index) in currentContent"
      :key="content.id"
      :content="content"
      :index="index"
    />
  </div>
</template>
<style lang="scss" scoped>
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.5s ease;
//   position: absolute;
// }

// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
// }

.table {
  --num-of-columns: v-bind("currentNumOfColumns");
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(var(--num-of-columns), auto);
  // gap: 10px;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  grid-template-areas: "header" ".";


  &_item {
    padding-inline: .5rem;
    border-top: 1px solid black;
    border-left: 1px solid black;

    background-color: rgba(255, 255, 255, .25);
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      text-align: center
    }

    &.header {
      border-bottom: 0;
      // grid-area: "header";
      position: sticky;
      top: 0;
      background-color: rgba(255, 227, 175);
    }
  }

  .description {
    grid-column: span var(--num-of-columns);
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      text-align: center;
    }
  }
}
</style>