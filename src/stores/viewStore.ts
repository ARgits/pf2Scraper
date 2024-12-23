import type { columnItem, columnsObject, contentFromQuery, KeysOfUnion, Routes } from "@/types";
import { defineStore } from "pinia";
import { computed, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import { pg as dbObject } from '@/main'
import { useContentStore } from "./content";
import { devLog } from "@/utils";
export const useViewStore = defineStore("view", () => {
  const route = useRoute()
  const router = useRouter()
  const {getData} = useContentStore()
  const viewTypeArray = ref<Record<Routes, 'table' | 'list'>>()
  const allColumns = ref<Record<Routes, columnsObject>>()
  const sortingCriteria = ref<Record<Routes,{ key: columnItem['key']; sorting: 'ASC' | 'DESC' }[]>>();

  const routeName = computed(() => (route.name as string).toLowerCase() as Routes)
  const viewType = computed(() => viewTypeArray.value ? viewTypeArray.value[routeName.value] : 'list')
  const currentNumOfColumns = computed(() => allColumns.value?.[routeName.value].numOfColumns ?? 0)
  const currentColumns = computed(() => allColumns.value?.[routeName.value].columns.toSorted((a, b) => a.order - b.order) ?? [])
  const currentSortingCriteria = computed(()=> sortingCriteria.value?.[routeName.value])
  const currentSortingOrder = computed(()=>
    sortingCriteria.value?
  sortingCriteria.value[routeName.value].map(
    criterion => {
      switch (criterion.key){
        case "name":
        case "original_name":{
          return `nullif(lower(${criterion.key}),'') ${criterion.sorting} nulls last`
            break
          }
        case "rarity":{
          return `array_position(array['common','uncommon','rare','unique'],rarity) ${criterion.sorting}`
          break
        }
        default:{
          return `${criterion.key} ${criterion.sorting}`
        }
      }
      }).join(', ')
  :'')


function saveSortingCriteria(newSortingCriteria:{key:columnItem['key'],sorting:'ASC'|'DESC'}[], dataType=routeName.value) {
  if(!sortingCriteria.value) return
  console.log(newSortingCriteria)

  sortingCriteria.value[dataType] = newSortingCriteria.map((v)=>{return{...v}});
  getData().then(()=>devLog('data sorted'))
}

function getSortingOrder(dataType=routeName.value) {
  if(!sortingCriteria.value) return
    return sortingCriteria.value[dataType].map(criterion => `${criterion.key} ${criterion.sorting}`).join(', ');
}
  function initViewTypeArray() {
    const obj = <Record<Routes, 'list' | 'table'>>{}
    for (const path of router.getRoutes().filter(r => r.name && (r.name !== 'content') && (r.name !== 'favorite'))) {
      const name = path.name as Routes
      obj[name] = 'list'
    }
    viewTypeArray.value = { ...obj }
  }

  function setViewType() {
    if (!viewTypeArray.value) return
    
    viewTypeArray.value[routeName.value] = viewType.value === 'list' ? 'table' : 'list'
  }

  async function getAllColumns() {
    const obj = <Record<Routes, columnsObject>>{}
    const sortingObj = <Record<Routes,{key: columnItem['key']; sorting: 'ASC' | 'DESC' }[]>>{}
    for (const path of router.getRoutes().filter(r => r.name && (r.name !== 'content') && (r.name !== 'favorite'))) {
      const name = path.name as Routes
      const queryResult = (await dbObject.query<{ key: KeysOfUnion<contentFromQuery>, name: string, isShown: boolean, order: number }>(`
      with columns_names as (
        select column_name 
        from information_schema.columns 
        WHERE table_name = 'content'
      )
      select distinct
        column_name as key,
        case
          when column_name=id then
            case
              when option_name!='' then option_name
              else filter_name
            end
          when column_name=type then filter_name
        end as name
      from data_filter, columns_names
      where column_name=type and data_type=$1`, [name.replace('favorite', '').toLowerCase()])).rows.map((v, ind) => { return { ...v, isShown: true, order: ind + 2 } });
      sortingObj[name] = [{key:'name',sorting:'ASC'}]
      queryResult.push({ key: 'name', name: 'название (RU)', isShown: true, order: 0 }, { key: 'original_name', name: 'название (EN)', isShown: true, order: 1 })
      obj[name] = { columns: queryResult, numOfColumns: queryResult.length }
    }
    sortingCriteria.value = {...sortingObj}
    allColumns.value = { ...obj }
  }
  function setColumnOrder(key:columnItem['key'], order:columnItem['order'],dataType=routeName.value){
    if(!allColumns.value) return
    const columnIndex = allColumns.value[dataType].columns.findIndex(v=>v.key===key)
    if(columnIndex===-1) return
    const nextColumnIndex = allColumns.value[dataType].columns.findIndex(v=>v.order===order)
    if(nextColumnIndex===-1) return
    const currentOrder = allColumns.value[dataType].columns[columnIndex].order
    allColumns.value[dataType].columns[columnIndex].order = order
    allColumns.value[dataType].columns[nextColumnIndex].order = currentOrder
  }
  function changeColumnVisibility(key:columnItem['key'],dataType=routeName.value){
    if(!allColumns.value) return
    const columnIndex = allColumns.value[dataType].columns.findIndex(v=>v.key===key)
    if(columnIndex===-1) return
    allColumns.value[dataType].columns[columnIndex].isShown = !allColumns.value[dataType].columns[columnIndex].isShown
    allColumns.value[dataType].numOfColumns = allColumns.value[dataType].columns.filter(v=>v.isShown).length
  }
  return {
    //ref
    viewTypeArray,
    allColumns,
    sortingCriteria,

    //computed
    viewType,
    currentNumOfColumns,
    currentColumns,
    currentSortingCriteria,
    currentSortingOrder,

    //function
    initViewTypeArray,
    setViewType,
    getAllColumns,
    setColumnOrder,
    changeColumnVisibility,
    saveSortingCriteria,
    getSortingOrder
  }
}
)