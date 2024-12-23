<script setup lang="ts">
import {  ref, watch } from 'vue';
import { Draggable } from 'gsap/Draggable';
const {bounds=null, type="x,y", trigger='',liveSnap={}, onMove=()=>{}, onDrag=()=>{}, onDragStart=()=>{}, onDragEnd=()=>{}, onPress=()=>{},onRelease=()=>{},snap={},dragResistance=0} =defineProps<{
  bounds?:Draggable.Vars["bounds"],
  type?:Draggable.DraggableType,
  trigger?:Draggable.Vars["trigger"],
  liveSnap?:Draggable.Vars["liveSnap"],
  snap?:Draggable.Vars["snap"]
  onMove?:Draggable.Vars["onMove"],
  onDrag?:Draggable.Vars["onDrag"],
  onDragStart?:Draggable.Vars["onDragStart"],
  onDragEnd?:Draggable.Vars["onDragEnd"],
  onPress?:Draggable.Vars["onPress"],
  onRelease?:Draggable.Vars["onRelease"],
  dragResistance?:Draggable.Vars["dragResistance"]}>()
const slotRef = ref<HTMLElement|null>(null)
watch(slotRef,()=>{
  if(slotRef.value) {
    
    new Draggable(slotRef.value,{
      trigger,
      bounds,
      type,
      snap,
      liveSnap,
      dragResistance,
      onMove,
      onDrag,
      onDragStart,
      onDragEnd,
      onPress,
      onRelease
    })}})
</script>
<template>
  <div
    ref="slotRef"
    class="draggable"
  >
    <slot />
  </div>
</template>
<style lang="scss" scoped>
</style>