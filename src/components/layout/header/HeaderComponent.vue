<script setup lang="ts">
import DesktopHeader from "@components/layout/header/DesktopHeader.vue"
import MobileHeader from "@components/layout/header/MobileHeader.vue"
import { isMobile } from "@/utils";


</script>
<template>
  <MobileHeader v-if="isMobile" />
  <DesktopHeader v-else />
</template>
<style scoped lang="scss">
header {
  display: flex;
  flex-basis: 5%;
  max-width: calc(100% - 4rem);
  width: fit-content;
}
</style>