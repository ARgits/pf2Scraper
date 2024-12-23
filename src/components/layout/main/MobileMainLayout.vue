<script setup lang="ts">
import FilterComponent from '@components/filter/FilterComponent.vue';
import SearchComponent from '@components/utility/SearchComponent.vue';
import { currentMobileMenu, devLog } from "@/utils"
// import ContentContainer from '../content/ContentContainer.vue';
import TableComponent from '@/components/utility/TableComponent.vue';
import { useRoute } from "vue-router";
import FooterComponent from "@components/layout/FooterComponent.vue";
import { computed } from "vue";

const route = useRoute()
const routeName = computed(() => route.name as string)
const nameToTab: Record<string, string> = {
  spells: 'Заклинания',
  backgrounds: 'Происхождения',
  actions: 'Действия',
  feats: 'Способности',
  creatures: 'Бестиарий',
  ancestries: 'Родословные'
}
computed(() => {
  devLog('MobileMainLayout:', routeName.value)
  let name = ''
  if (routeName.value.includes('favorite')) {
    name += 'Избранное: '
  }
  name += nameToTab[routeName.value.replace('favorite', '').toLowerCase()]
  return name
})
const isStandAlone = computed(()=>route.path.includes('content'))
</script>
<template>
  <template v-if="currentMobileMenu === 'content'&&!isStandAlone">
    <SearchComponent />
    <TableComponent />
  </template>
  <template v-else-if="currentMobileMenu === 'filterSearch'">
    <FilterComponent />
  </template>
  <template v-else-if="currentMobileMenu === 'about'">
    <FooterComponent />
  </template>
</template>
<style lang="scss" scoped>
* {
  text-align: center;
}

h3 {
  margin: 0;
}

a {
//   flex: 1;
  border: 1px solid black;
  border-radius: var(--border-radius);
  padding: .5rem;
//   margin: 0 auto;
  text-decoration: unset;
}
</style>