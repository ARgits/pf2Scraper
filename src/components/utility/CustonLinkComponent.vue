<script setup lang="ts">
import { devLog } from '@/utils';
import type { DataRoutes } from '@/types';
import { computed } from 'vue';

const props = defineProps<{ name: string, label: string }>()
const data_type = computed(() => props.name.replace('favorite', '').toLocaleLowerCase() as DataRoutes | '')
devLog(`data_type in custom link component: ${data_type.value}`)
</script>
<template>
  <RouterLink :to="{ name: props.name }">
    {{ props.label }}
  </RouterLink>
</template>
<style lang="scss" scoped>
@property --fetchedColor {
    syntax: '<color>';
    initial-value: rgba(128, 128, 128, .55);
    inherits: false;
}

a {
    transition: --fetchedColor .5s ease;
    // --fetchedColor: rgba(128, 128, 128, .55);
    // background: linear-gradient(90deg, var(--fetchedColor) 0 v-bind(length), rgba(128, 128, 128, .85) v-bind(length) 100%);
    background: var(--fetchedColor);

    &.router-link-active {
        --fetchedColor: rgba(128, 128, 128, .15)
    }
}
</style>