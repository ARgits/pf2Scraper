<script setup lang="ts">
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faStar, faFilter, faInfo, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useRoute } from 'vue-router';
import { currentMobileMenu} from '@/utils';
import {v4 as uuid4} from 'uuid'
import MobileNavigation from './MobileNavigation.vue';


const route = useRoute()
const currentNavigationMenu = ref('')
watch([route, currentMobileMenu], ([_,oldMenu],[__, newMenu]) => {
  if(oldMenu===newMenu){
    currentMobileMenu.value='content'
  }
  currentNavigationMenu.value=''
}
)
function changeMenu(menuName:  string) {
  if(menuName==='filterSearch'||menuName==='about'){
    currentMobileMenu.value = currentMobileMenu.value === menuName ? 'content' : menuName
  }
}
function showMenu(menuName:string){
  currentNavigationMenu.value = currentNavigationMenu.value!==menuName?menuName:''
}
const buttons:{
  id:string,
  icon:IconDefinition,
  vIf:boolean,
  onClick:[(str:string)=>void,string]
}[] = [{
  id:uuid4(),
  icon:faBars,
  onClick:[showMenu,'router'],
  vIf:true
},{
  id:uuid4(),
  icon:faStar,
  onClick:[showMenu,'favorites'],
  vIf:true
},{
  id:uuid4(),
  icon:faFilter,
  onClick:[changeMenu,'filterSearch'],
  vIf:!route.path.includes('content')
},{
  id:uuid4(),
  icon:faInfo,
  onClick:[changeMenu,'about'],
  vIf:true
}]
</script>
<template>
  <header class="header mobile">
    <div class="wrapper flex">
      <template
        v-for="btn of buttons"
        :key="btn.id"
      >
        <button
          v-if="btn.vIf"
          class="button"
          @click="()=>{const [fn, arg]=btn.onClick; fn(arg)}"
        >
          <FontAwesomeIcon
            :icon="btn.icon"
            size="3x"
          />
        </button>
      </template>
    </div>
    <MobileNavigation :data="currentNavigationMenu" />
  </header>
</template>
<style lang="scss" scoped>
.header.mobile {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: auto;
  gap: 10px;
  position: relative;
  // max-height: 100%;
  z-index: 2;
  background: var(--background-img);
}

.button {
  flex: 1;
  border: none;
}
</style>