<script setup lang="ts">
import { ref, watch, } from 'vue'
import gsap from 'gsap';
import { useElementSize } from '@vueuse/core';
const { maxHeight=500, onComplete=()=>{}, } = defineProps<{ maxHeight?: number|string, onComplete?: () => void }>()
const elemRef = ref()
const { height } = useElementSize(elemRef)
const transitionDone = ref(true)

/**in cases where element changes it's height without transitioning (when we filter options for example) */
watch(height, () => {
  if (transitionDone.value) {
    
    onEnter(elemRef.value, () => { })
  }
})
function onBeforeEnter(el: Element) {
  elemRef.value = el
  transitionDone.value = false
  gsap.set(el, {
    overflowY: "hidden",
    opacity: 0,
    minHeight: 0
  })
  gsap.to(el, {
    opacity: 1,
  })
}
function onEnter(el: Element, done: () => void) {
  const maxElemHeight = typeof maxHeight==='number'? Math.min(el.getBoundingClientRect().height * 1.5, maxHeight) + "px":maxHeight
  gsap.to(el, {
    maxHeight: maxElemHeight,
    onComplete: () => {
      gsap.set(el, { clearProps: "minHeight", overflowY: "auto", })
      done();
      onComplete();

    }
  })
}
function onAfterEnter(el: Element) {
  gsap.set(el, {
    onComplete: () => {
      transitionDone.value = true;
    }
  })
}

function onLeave(el: Element, done: () => void) {
  transitionDone.value = false
  
  gsap.to(el, {
    maxHeight: 0,
    minHeight: 0,
    overflowY: "hidden",
    onComplete: () => {
      done();
      onComplete();
      transitionDone.value = true
    }
  })
}
</script>
<template>
  <Transition
    name="containerSlide"
    :css="false"
    appear
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>
<style lang="scss"></style>