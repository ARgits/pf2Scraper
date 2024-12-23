<script setup lang="ts">
defineProps<{data:string}>()
</script>
<template>
  <nav class="navigation mobile router">
    <template v-if="$props.data==='router'">
      <RouterLink :to="{ name: 'backgrounds' }">
        Происхождения
      </RouterLink>
      <RouterLink :to="{ name: 'feats' }">
        Способности
      </RouterLink>
      <RouterLink :to="{ name: 'actions' }">
        Действия
      </RouterLink>
      <RouterLink :to="{ name: 'creatures' }">
        Бестиарий
      </RouterLink>
      <RouterLink :to="{ name: 'spells' }">
        Заклинания
      </RouterLink>
      <RouterLink :to="{ name: 'ancestries' }">
        Родословные
      </RouterLink>
    </template>
    <template v-else-if="$props.data==='favorites'">
      <RouterLink 
        :to="{ name: 'favoriteBackgrounds' }"
      >
        Избранное: Происхождения
      </RouterLink>
      <RouterLink 
        :to="{ name: 'favoriteFeats' }"
      >
        Избранное: Способности
      </RouterLink>
      <RouterLink 
        :to="{ name: 'favoriteActions' }"
      >
        Избранное: Действия
      </RouterLink>
      <RouterLink 
        :to="{ name: 'favoriteCreatures' }"
      >
        Избранное: Бестиарий
      </RouterLink>
      <RouterLink 
        :to="{ name: 'favoriteSpells' }"
      >
        Избранное: Заклинания
      </RouterLink>
      <RouterLink 
        :to="{ name: 'favoriteAncestries' }"
      >
        Избранное: Родословные
      </RouterLink>
    </template>
  </nav>
</template>
<style scoped lang="scss">
.navigation.mobile{
    padding: 1rem 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 100%;
    // opacity: 0;
    // background: var(--background-img);
    // z-index: 2;
    width: calc(100% - 0rem);
    max-height: 100dvh;
    transition: max-height 1s ease;
    border-bottom: 1px solid black;
    border-radius: var(--border-radius);
    background: inherit;

    /**when it's not expanded */
    &:not(:has(>*)){
        border: unset;
        max-height: 0;
        padding: 0;
    }
    > a{
        padding: 0 2rem;
        border:1px transparent;
        border-radius: var(--border-radius);
        &:nth-child(odd){
        background-color: rgba(grey,.5);
    }}
}
</style>