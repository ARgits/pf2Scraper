<script setup lang="ts">
import { useModalWindows } from '@stores/modalWindows';
import type { generalContent } from '@types';
import { Draggable } from 'gsap/Draggable';
import { computed, ref, type Ref, watch } from 'vue';
import ContentItem from '@components/content/ContentItem.vue';
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from 'pinia';
const props = defineProps<{ id: generalContent["id"] }>()
const modalStore = useModalWindows()
const { closeModal } = modalStore
const { modalData } = storeToRefs(modalStore)
const containerRef: Ref<HTMLElement | null> = ref(null)
const item = computed(() => modalData.value.get(props.id)!)
const show = computed(() => item.value.show)
const data = computed(() => item.value.data)
const name = computed(() => item.value.name)
watch(containerRef, () => {
  if (containerRef.value) {
    const zIndex = [...document.querySelectorAll('.modal[id]')].reduce((prev, next) => Math.max(prev, parseInt(getComputedStyle(next).zIndex) || 1000), 1000);
    new Draggable(`.modal#${props.id}`, {
      dragClickables: false,
      trigger: `.modal#${props.id} .header`,
      zIndex,

    })

  }
})
</script>
<template>
  <Transition name="fade">
    <div
      v-if="show"
      :id="props.id"
      ref="containerRef"
      class="modal container"
    >
      <div class="header">
        <span>{{ name }}</span>
        <button
          class="button close"
          aria-label="close modal window"
          @click="closeModal(props.id)"
        >
          <FontAwesomeIcon :icon="faSquareXmark" />
        </button>
      </div>
      <div class="main">
        <template v-if="data">
          <div v-if="!data.name?.length || !data.original_name?.length">
            <p>Видимо, этого контента пока нет на сайте, но ты можешь почитать про него здесь</p>
            <ul>
              <li v-if="data.aon_url">
                <a :href="data.aon_url">Archives of Nethys ({{ name }})</a>
              </li>
              <li v-if="data.external_ru_url">
                <a :href="data.external_ru_url">Сайт "Юры" ({{ name }})</a>
              </li>
            </ul>
          </div>
          <ContentItem
            v-else
            :content="data"
            :in-grid="false"
            :modal="true"
            :is-desc-opened="true"
          />
        </template>
        <span v-else> Видимо, этого контента пока нет на сайте:(</span>
      </div>
    </div>
  </Transition>
</template>
<style scoped lang="scss">
.container {
    position: absolute;
    // border: 1px solid black;
    background: inherit;
    width: max-content;
    height: max-content;
    max-width: 50%;
    // max-height: 50%;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.close {
    position: absolute;
    right: 0;
    top: 0;
    aspect-ratio: 1/1;
    border-color: transparent;

}

.fade {

    &-enter-active,
    &-leave-active {
        transition: all .5s ease;
    }

    &-enter-from,
    &-leave-to {
        opacity: 0
    }
}

.button.close {
    display: inline;
    padding: 0;
    float: right;
    border: 0;
    background: none;
    margin: 5px;
    height: 1.5rem;
}
</style>