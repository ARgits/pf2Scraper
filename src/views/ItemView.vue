<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ContentItem from '@/components/content/ContentItem.vue';
import { storeToRefs } from 'pinia';
import { useContentStore } from '@/stores/content';
import type { generalContent } from '@/types';
import { isMobile, currentMobileMenu } from '@/utils';
import MobileMainLayout from '@/components/layout/main/MobileMainLayout.vue';

const route = useRoute()
const id = computed(() => route.params.id as generalContent['id'])
const contentStore = useContentStore()
const {getItem} = contentStore
const { isDataFetched } = storeToRefs(contentStore)
const content = ref<generalContent>()
watch(isDataFetched,async ()=>content.value = await getItem(id.value))
</script>
<template>
  <template v-if="!isMobile || currentMobileMenu === 'content'">
    <ContentItem
      v-if="content"
      :content
      :is-desc-opened="true"
    />
  </template>
  <template v-else>
    <MobileMainLayout />
  </template>
</template>
<style scoped lang="scss"></style>``