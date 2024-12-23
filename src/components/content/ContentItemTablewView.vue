<script setup lang="ts">
import { useViewStore } from '@/stores/viewStore';
import type { generalContent } from '@/types';
import { storeToRefs } from 'pinia';
import ContentTraits from './ContentTraits.vue';
import { capitalize, computed } from 'vue';
import { useModalWindows } from '@/stores/modalWindows';

const {content,index} = defineProps<{content:generalContent,index:number}>()
const {currentColumns} = storeToRefs(useViewStore())
const shownColumns = computed(()=>currentColumns.value.filter((v)=>v.isShown))
const {showModal} = useModalWindows()
function getIdAndNameForModal(index:number){
  const [name,id] = content.feat_markdown[index].split('](').map(v=>v.replace(/\[|\)/g,''))
  return {id,name}
}
</script>
<template>
  <div
    v-for="(column) in shownColumns"
    :key="column.key+content.id"
    :data-key="column.key"
    class="table_item"
    :class="{even:index%2===0}"
  >
    <ContentTraits
      v-if="column.key==='trait'&&content.trait"
      :trait="content.trait"
    />
    <ul v-else-if="Array.isArray(content[column.key])">
      <li
        v-for="(str,ind) in content[column.key]"
        :key="str"
      >
        <button
          v-if="column.key==='feat'"
          @click="(e)=>showModal(getIdAndNameForModal(ind).id,e,getIdAndNameForModal(ind).name)"
        >
          {{ capitalize(str) }}
        </button>
        <span v-else>
          {{ capitalize(str) }}
        </span>
      </li>
    </ul>
    <span v-else-if="content[column.key]">
      {{ capitalize(content[column.key].toString()??'') }}
    </span>
  </div>
</template>
<style scoped lang="scss">
.table_item{
    padding-inline: .5rem;
    border-top: 1px solid black;
    border-left: 1px solid black;

    background-color: rgba(255, 255, 255, .25);
    display: flex;
    justify-content: center;
    align-items: center;
    &.even{
        background-color: rgba(255, 255, 255, .75);
    }
    span {
      text-align: center
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