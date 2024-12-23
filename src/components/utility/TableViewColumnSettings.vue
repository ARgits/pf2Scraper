<script setup lang="ts">
import { ref, capitalize} from 'vue'
import { OnClickOutside,} from '@vueuse/components';
import ContainerFadeSlideTransition from '../transitions/ContainerFadeSlideTransition.vue';
import {useViewStore} from '@/stores/viewStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {storeToRefs} from 'pinia'
import CustomSortSettings from './CustomSortSettings.vue';
const isOpened = ref(false)

const viewStore = useViewStore()
const {currentColumns, viewType} = storeToRefs(viewStore)
const { setColumnOrder, changeColumnVisibility} = viewStore
function close() {
  isOpened.value = false
}
</script>
<template>
  <OnClickOutside
    v-if="viewType==='table'"
    @trigger="close"
  >
    <div class="sort wrapper">
      <div @click="isOpened = true">
        Показывать колонки
      </div>
      <div
        v-if="isOpened"
        class="sort inner"
      >
        <ContainerFadeSlideTransition>
          <div
            v-for="(column, ind) in currentColumns"
            :key="column.key"
            class="column"
            :class="{ hidden: !column.isShown }"
          >
            <span>
              <button
                :disabled="ind === 0"
                @click="
                  () => {
                    setColumnOrder(column.key, ind - 1)
                  }
                "
              >
                <FontAwesomeIcon :icon="faArrowUp" />
              </button>
              <button
                :disabled="ind === currentColumns.length - 1"
                @click="
                  () => {
                    setColumnOrder(column.key, ind + 1)
                  }
                "
              >
                <FontAwesomeIcon :icon="faArrowDown" />
              </button>
            </span>
            <span>
              {{ capitalize(column.name) }}
            </span>
            <button>
              <FontAwesomeIcon
                :icon="column.isShown ? faEyeSlash : faEye"
                @click="changeColumnVisibility(column.key)"
              />
            </button>
          </div>
        </ContainerFadeSlideTransition>
      </div>
    </div>
  </OnClickOutside>
  <CustomSortSettings />
</template>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding: 5px;
  width: 200px;
  background: var(--background-img);
  border: 1px solid black;
  border-radius: var(--border-radius);
  box-sizing: border-box;

  &:has(>.inner) {
    border-color: transparent;
  }

  .inner {
    background: var(--background-img);
    border: 1px solid black;
    border-radius: var(--border-radius);
    position:absolute;
    z-index: 2;
    padding: 5px;
    width: 100%;
    top: 0;
    left: 0;
    display: grid;
    grid-template-rows: repeat(v-bind('currentColumns.length'),3rem);
    box-sizing: border-box;
    max-height: 500px;
    overflow-y: auto;
    align-items: center;

  }
}
.column{
      will-change: background-color;
      user-select: none;
      border:1px solid black;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      &.hidden{
        background-color: rgba(grey,.5);
      }
      &:not(.fadeSlide-move){
        transition: background-color .5s ease;
      }
    }
</style>
