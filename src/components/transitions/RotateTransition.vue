<script setup lang="ts">
import { toRef, } from 'vue'
const props = withDefaults(defineProps<{ angle?: number | string, trigger: boolean }>(), {
  angle: '90deg'
})
const angle = toRef(props.angle)
</script>
<template>
  <span
    class="wrapper"
    :class="$props.trigger ? 'rotate' : ''"
  >
    <slot />
  </span>
</template>
<style scoped lang="scss">
:slotted(*) {
    transition: transform .5s ease;
}

.rotate>:slotted(*) {
    transform: rotate(v-bind(angle));
}
</style>