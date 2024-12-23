<script setup lang="ts">
import { computed } from 'vue';
import MobileMainLayout from '@/components/layout/main/MobileMainLayout.vue';
import DesktopMainLayout from '@/components/layout/main/DesktopMainLayout.vue';
import { isMobile } from '@/utils';
import { useContentStore } from '@/stores/content';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const contentStore = useContentStore()
const isFetched = computed(() => contentStore.isDataFetched)

</script>
<template>
  <template v-if="isFetched">
    <MobileMainLayout v-if="isMobile" />
    <DesktopMainLayout v-else />
  </template>
  <template v-else>
    <div class="loading">
      <FontAwesomeIcon
        :icon="faSpinner"
        spin
        size="5x"
      />
    </div>
  </template>
</template>

<style scoped lang="scss"></style>
