<script setup lang="ts">
import { computed, ref, type Ref, } from "vue"

import type { generalContent } from '@types';
import ContentDescription from "./ContentDescription.vue";
import ContentTraits from "./ContentTraits.vue";
import ContainerSlideTransition from "@components/transitions/ContainerSlideTransition.vue";
import FavoriteButton from "./FavoriteButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCaretDown, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import RotateTransition from "@components/transitions/RotateTransition.vue";
import { useModalWindows } from "@stores/modalWindows";
import { useRoute, useRouter } from "vue-router";
import { devLog } from "@/utils";

const props = defineProps<{ content: generalContent, modal?: boolean, isDescOpened?: boolean }>()
const router = useRouter();
const route = useRoute()
const isStandAlone = computed(() => route.path.includes('content') && route.params.id === props.content.id)
const { closeModal } = useModalWindows()

const itemElem: Ref<HTMLDivElement | null> = ref(null);
const nameElem: Ref<HTMLDivElement | null> = ref(null);
const isDescVisible = ref(props.isDescOpened ?? false)
const descLang = ref(props.content.description.length ? 'RU' : 'EN')
function showHideDesc() {
  isDescVisible.value = !isDescVisible.value
  devLog('contentItem data', props.content)
  if (isDescVisible.value) {
    itemElem.value!.scrollIntoView({ behavior: 'smooth' })

  } else {
    itemElem.value!.children.item(1)!.scrollTop = 0
  }
}
function close() {
  closeModal(props.content.id)
}
function hasLevel(item:generalContent&{level?:number}):item is generalContent&{level:number}{
  return item.level!==undefined
}
function openInOtherTab() {
  const routeData = router.resolve({ path: `/content/${props.content.id}`, });
  window.open(routeData.href, '_blank');
}
</script>
<template>
  <div
    ref="itemElem"
    class="content_item"
    :class="{ raw: content.is_translate_raw, standalone: isStandAlone }"
  >
    <div
      ref="nameElem"
      class="name"
    >
      <button
        v-if="!isStandAlone"
        aria-label="open in other browser tab"
        class="button"
        @click="openInOtherTab"
      >
        <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
      </button>
      <FavoriteButton :id="content.id" />
      <div
        v-if="content.original_desc !== ''"
        class="button radio"
      >
        <input
          v-if="content.description !== ''"
          v-model="descLang"
          type="radio"
          value="RU"
          data-lang="RU"
        >
        <input
          v-if="content.original_desc !== ''"
          v-model="descLang"
          type="radio"
          value="EN"
          data-lang="EN"
        >
      </div>
      <div v-if="content.name || content.original_name">
        <div>{{ content.name }}</div>
        <div>{{ content.original_name }}</div>
        <div v-if="hasLevel(content)">
          Уровень: {{ content.level }}
        </div>
      </div>
      <hr>
    </div>
    <template v-if="content.trait?.length">
      <ContentTraits :trait="content.trait" />
      <hr>
    </template>
    <button
      v-if="!isStandAlone"
      aria-label="show or hide description"
      class="button"
      @click="showHideDesc"
    >
      <RotateTransition
        angle="180deg"
        :trigger="isDescVisible"
      >
        <FontAwesomeIcon :icon="faCaretDown" />
      </RotateTransition>
      Описание
      <RotateTransition
        angle="180deg"
        :trigger="isDescVisible"
      >
        <FontAwesomeIcon :icon="faCaretDown" />
      </RotateTransition>
    </button>
    <ContainerSlideTransition v-if="!isStandAlone">
      <ContentDescription
        v-if="isDescVisible"
        :description="descLang === 'RU' ? content.description : content.original_desc"
      />
    </ContainerSlideTransition>
    <ContentDescription
      v-else-if="isDescVisible"
      :description="descLang === 'RU' ? content.description : content.original_desc"
    />
  </div>
</template>
<style lang="scss" scoped>
.content_item {
  border: 1px solid black;
  border-radius: var(--border-radius);

  padding: 5px;
  width: calc(100% - 12px);
  max-width: 100%;
  max-height: 500px;
  scrollbar-gutter: stable;
  height: min-content;
  display: flex;
  flex-direction: column;
  transition: 1s;
  background: var(--background-img);

  &>.button {
    background-color: hsla(0, 0%, 0%, .1);
  }

  & .name>.button {
    border: none;
    display: inline;
    float: right;
    margin: 5px;
    line-height: normal;
  }

  &.raw {
    box-shadow: inset 0 0 5px 2px red;
  }

  &.standalone {
    height: 0;
    flex: 1 0 0;
    max-height: unset;
  }
}



.button.active {
  background-color: green
}

.name>.button.radio {
  // display: inline-flex;
  width: 3rem;
  height: 1em;
  margin: 5px;
  position: relative;
  // gap: 1.5rem;
  // justify-content: space-between;

  & input {
    position: absolute;
    // opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    margin: 0;
    transition: background-color .5s ease;

    &:checked {
      background-color: green;
    }

    // position: relative;
    &:last-child {
      left: 50%;

      &::before {
        border-radius: 0 5px 5px 0;
      }
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      opacity: 1;
      display: inline-block;
      height: 1em;
      // aspect-ratio: 1/1;
      width: 1.5rem;
      border: 1px solid black;
      border-radius: 5px 0 0 5px;
      background-color: inherit;
    }

    &::after {
      position: absolute;
      top: .25em;
      // left: 0;
      display: inline-block;
      height: 1em;
      width: 1.5rem;
      opacity: 1;
    }

    &[data-lang]::after {
      content: attr(data-lang);
      font-size: 75%;
      text-align: center
    }
  }
}

.name {

  &>div {
    font-size: 110%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-aspect-ratio: 1/1) {
  .content_item {
    --max-width: 100%;
  }
}
</style>