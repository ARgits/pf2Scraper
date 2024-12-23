<script lang="ts" setup>
import { ref, capitalize, reactive, computed, watch, } from 'vue'
import { OnClickOutside,} from '@vueuse/components';
import ContainerFadeSlideTransition from '../transitions/ContainerFadeSlideTransition.vue';
import {useViewStore} from '@/stores/viewStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUp, faArrowDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import {storeToRefs} from 'pinia'
import type {columnItem} from '@/types'
const isOpened = ref(false)
const viewStore = useViewStore()
const {currentColumns,currentSortingCriteria, currentSortingOrder} = storeToRefs(viewStore)
const { saveSortingCriteria, getSortingOrder } = viewStore
const sortOptions = reactive<{key:columnItem['key']|'-',sorting:'ASC'|'DESC'}[]>(currentSortingCriteria.value?currentSortingCriteria.value.map(v=>{return{...v}}):[{key:'name',sorting:'ASC'}])
const sortWithoutEmpty = computed(()=>sortOptions.filter((v)=>v.key!=='-') as {key:columnItem["key"],sorting:'ASC'|'DESC'}[])
const sortingOrder = computed(()=>sortWithoutEmpty.value.map((v)=>
{switch (v.key){
case "name":
case "original_name":{
  return `nullif(lower(${v.key}),'') ${v.sorting} nulls last`
}
case "rarity":{
  return `array_position(array['common','uncommon','rare','unique'],rarity) ${v.sorting}`
}
default:{
  return `${v.key} ${v.sorting}`
}
}}
).join(', '))
const sortingChanged = computed(()=> currentSortingOrder.value!==sortingOrder.value)
function close() {
  isOpened.value = false
  // sortOptions.splice(0,sortOptions.length,...currentSortingCriteria.value!.map(v=>{return{...v}}))
}
function addSorting(){
  sortOptions.push({key:'-',sorting:'ASC'})
  console.log(getSortingOrder(),sortingOrder.value)
}
function removeSort(ind:number){
  sortOptions.splice(ind,1)
}
function moveColumnUp(key:columnItem['key']|"-"){
  const index = sortOptions.findIndex(item => item.key === key)
  if(index > 0){
    const temp = sortOptions[index];
    sortOptions[index] = sortOptions[index - 1];
    sortOptions[index - 1] = temp;

  }
}
function moveColumnDown(key:columnItem['key']|"-"){
  const index = sortOptions.findIndex(item => item.key === key)
  if(index<sortOptions.length-1&&index!==-1){
    const temp = sortOptions[index];
    sortOptions[index] = sortOptions[index + 1];
    sortOptions[index + 1] = temp
  }
}
watch(isOpened,()=>sortOptions.splice(0,sortOptions.length,...currentSortingCriteria.value!.map(v=>{return{...v}})))
</script>
<template>
  <OnClickOutside @trigger="close">
    <div class="wrapper">
      <div @click="isOpened = true">
        сортировка
      </div>
      <div
        v-if="isOpened"
        v-box-shadow
        class="sort inner"
      >
        <ContainerFadeSlideTransition>
          <div
            v-for="(column, ind) in sortOptions"
            :key="column.key"
            class="column"
          >
            <span>
              <button
                :disabled="ind === 0||column.key==='-'"
                @click="moveColumnUp(column.key) "
              >
                <FontAwesomeIcon :icon="faArrowUp" />
              </button>
              <button
                :disabled="(column.key==='-')||(ind===sortOptions.filter(c=>c.key!=='-').length-1)||(ind === currentColumns.length - 1)"
                @click="moveColumnDown(column.key)"
              >
                <FontAwesomeIcon :icon="faArrowDown" />
              </button>
            </span>
            <select
              v-model="sortOptions[ind].key"
            >
              <option
                v-for="opt in currentColumns.filter(c=>c.key===column.key||!sortOptions.some(o=>o.key===c.key))"
                :key="opt.key"
                :value="opt.key"
              >
                {{ capitalize(opt.name) }}
              </option>
            </select>
            <select v-model="sortOptions[ind].sorting">
              <option value="ASC">
                По возрастанию
              </option>
              <option value="DESC">
                По убыванию
              </option>
            </select>
            <span><button
              :disabled="ind===0"
              @click="removeSort(ind)"
            ><FontAwesomeIcon :icon="faMinus" /></button></span>
          </div>
          <button
            v-if="sortOptions.length!==currentColumns.length"
            @click="addSorting()"
          >
            <FontAwesomeIcon :icon="faPlus" />
          </button>
          <button
            :disabled="!sortingChanged"
            @click="saveSortingCriteria(sortWithoutEmpty)"
          >
            Сохранить сортировку
          </button>
        </ContainerFadeSlideTransition>
      </div>
    </div>
  </OnClickOutside>
</template>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding: 5px;
  width: 300px;
  background: var(--background-img);
  border: 1px solid black;
  border-radius: var(--border-radius);
  box-sizing: border-box;

  &:has(>.inner) {
    border-color: transparent;
  }

  .inner {
    background: var(--background-img);
    border: 1px solid black;
    border-radius: var(--border-radius);
    position:absolute;
    z-index: 2;
    padding: 5px;
    width: 100%;
    top: 0;
    left: 0;
    display: grid;
    grid-template-rows: repeat(calc(v-bind('sortOptions.length') + 1),3rem);
    box-sizing: border-box;
    max-height: 500px;
    overflow-y: auto;
    align-items: center;

  }
}
.column{
      will-change: background-color;
      user-select: none;
      border:1px solid black;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      &.hidden{
        background-color: rgba(grey,.5);
      }
      &:not(.fadeSlide-move){
        transition: background-color .5s ease;
      }
    }
</style>