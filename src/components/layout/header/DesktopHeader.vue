<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ContainerSlideTransition from '@components/transitions/ContainerSlideTransition.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import CustomLinkComponent from '@components/utility/CustonLinkComponent.vue';
const route = useRoute()
const routeName = computed(() => route.name as string)
</script>
<template>
  <nav class="nav">
    <div>
      <CustomLinkComponent
        name="feat"
        label="Способности"
      />
      <CustomLinkComponent
        name="background"
        label="Происхождения"
      />
      <CustomLinkComponent
        name="spell"
        label="Заклинания"
      />
      <CustomLinkComponent
        name="creature"
        label="Бестиарий"
      />
      <CustomLinkComponent
        name="action"
        label="Действия"
      />
      <CustomLinkComponent
        name="ancestry"
        label="Родословные"
      />
      <CustomLinkComponent
        name="favorite"
        label="Избранное"
      />
    </div>
    <ContainerSlideTransition>
      <div v-if="routeName?.includes('favorite')">
        <RouterLink :to="{ name: 'favoriteFeat' }">
          Способности
        </RouterLink>
        <RouterLink :to="{ name: 'favoriteBackground' }">
          Происхождения
        </RouterLink>
        <RouterLink :to="{ name: 'favoriteSpell' }">
          Заклинания
        </RouterLink>
        <RouterLink :to="{ name: 'favoriteCreature' }">
          Бестиарий
        </RouterLink>
        <RouterLink :to="{ name: 'favoriteAction' }">
          Действия
        </RouterLink>
        <RouterLink :to="{ name: 'favoriteAncestry' }">
          Родословные
        </RouterLink>
        <FontAwesomeIcon
          :icon="faArrowTurnDown"
          rotation="90"
          size="2x"
        />
      </div>
    </ContainerSlideTransition>
  </nav>
</template>
<style scoped lang="scss">
.nav {
    width: fit-content;
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;


    & a {
        padding: 0 1rem;
        border-radius: 5px 5px 0 0;

        font-size: 110%;


        &.router-link-active {
            position: relative;
            color: black
        }
    }

    &:not(:has(+ *)) a.router-link-active {
        background-color: unset;
        top: 0
    }
}

// @media (max-aspect-ratio:1/1) {
//     .nav {
//         display: none;
//     }
// }</style>