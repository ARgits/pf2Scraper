<script setup lang="ts">
// const {additionalTransition=''} = defineProps<{additionalTransition?:string}>()
// Function for entering transition

</script>
<template>
  <TransitionGroup
    name="fadeSlide"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  >
    <slot />
  </TransitionGroup>
</template>
<style lang="scss">
 .fadeSlide-move,
 .fadeSlide-enter-active,
 .fadeSlide-leave-active {
   transition: transform .5s cubic-bezier(0.55, 0, 0.1, 1);
 }

 .fadeSlide-enter-from,
 .fadeSlide-leave-to {
   opacity: 0;
   transform: scaleY(0.01) translateX(30px);
 }

 .fadeSlide-leave-active {
   position: absolute;
 }
</style>