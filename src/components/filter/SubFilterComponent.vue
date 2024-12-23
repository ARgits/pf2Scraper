<script setup lang="ts">
import { useContentStore } from '@/stores/content';
import type { filterQueryResult } from '@/types';
import { ref, capitalize } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import RotateTransition from '@components/transitions/RotateTransition.vue';
import { faBan, faCaretLeft, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
const { resetFilter, updateMinFilterOption, updateMaxFilterOption, setDisabledTextFilterOption, setEnabledTextFilterOption } = useContentStore()
const { subFilter } = defineProps<{ subFilter: filterQueryResult }>()
const isClosed = ref(true)
function updateMaxOption(event: Event, option: string) {
  
  const el = event?.target as HTMLInputElement
  updateMaxFilterOption(option, parseInt(el.value), subFilter.data_group)
}
function updateMinOption(event: Event, option: string) {
  
  const el = event?.target as HTMLInputElement
  updateMinFilterOption(option, parseInt(el.value), subFilter.data_group)
}
function updateTextOption(option: string, type: 'enable' | 'disable') {
  
  if (type === 'enable') {
    setEnabledTextFilterOption(option, subFilter.data_group)
  } else {
    setDisabledTextFilterOption(option, subFilter.data_group)
  }
}
function checkNumericInput(event: KeyboardEvent) {
  const key = event.key
  const pattern = new RegExp((event.target as HTMLInputElement).pattern)

  
  if (!key.match(pattern) && key !== 'Backspace') {
    
    event.preventDefault()
    event.stopPropagation()
    return
  }
  const target = event.target as HTMLInputElement
  
  const newVal = key === 'Backspace' ? parseInt(target.value.slice(0, target.value.length - 1)) : parseInt(target.value + key)
  
  
  if (parseInt(target.min) > newVal || parseInt(target.max) < newVal) {
    
    event.stopImmediatePropagation()
  }
}
</script>
<template>
  <div>
    <div>
      <span class="name"> {{ capitalize(subFilter.filter_name) }}</span>
      <button
        v-if="subFilter.disabled.some(f => f) || subFilter.enabled.some(f => f)"
        class="icon"
        @click.stop="() => resetFilter(subFilter.data_group)"
      >
        <FontAwesomeIcon
          :icon="faBan"
          beat-fade
        />
      </button>
      <button
        class="icon"
        @click="() => isClosed = !isClosed"
      >
        <RotateTransition
          :trigger="!isClosed"
          angle="-90deg"
        >
          <FontAwesomeIcon :icon="faCaretLeft" />
        </RotateTransition>
      </button>
    </div>
    <div
      class="options"
      :class="{ closed: isClosed, grid: subFilter.data_max[0] }"
    >
      <template v-if="!subFilter.data_max[0]">
        <label
          v-for="(value, index) in subFilter.id"
          :key="value"
          class="options_item"
        >
          <span>{{ capitalize(subFilter.option_name[index]) }}</span>
          <button
            class="button"
            :class="{ enabled: subFilter.enabled[index], excluded: subFilter.exclude_enabled[index] }"
            @click="updateTextOption(value, 'enable')"
          >
            <FontAwesomeIcon :icon="faCheck" />
          </button>
          <button
            class="button"
            :class="{ disabled: subFilter.disabled[index], excluded: subFilter.exclude_disabled[index] }"
            @click="updateTextOption(value, 'disable')"
          >
            <FontAwesomeIcon :icon="faXmark" />
          </button>
        </label>
      </template>
      <template v-else>
        <template v-for="(value, index) in subFilter.id">
          <span v-if="value !== subFilter.data_group"> {{ capitalize(capitalize(subFilter.option_name[index])) }}
          </span>
          <label>От
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]"
              :min="subFilter.data_min_default[index]"
              :max="subFilter.data_max_default[index]"
              :value="subFilter.data_min[index]"
              @keydown="checkNumericInput"
              @change="(e) => updateMinOption(e, value)"
            >
          </label>
          <label>До
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]"
              :min="subFilter.data_min_default[index]"
              :max="subFilter.data_max_default[index]"
              :value="subFilter.data_max[index]"
              @keydown="checkNumericInput"
              @change="(e) => updateMaxOption(e, value)"
            >
          </label>
        </template>
      </template>
    </div>
  </div>
</template>
<style lang="scss">
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
  align-content: flex-start;
  overflow-y: hidden;
  scrollbar-gutter: stable;
  padding: 0 .5rem;
  height: calc-size(auto, size);
  transition: height .2s ease;
  transition-behavior: allow-discrete;

  & input {
    max-width: 4rem;
  }

  &_item {
    display: flex;
    justify-content: center;
    align-items: stretch;
    border: 1px solid black;
    border-radius: var(--border-radius);

    span {
      padding: 0 10px;
      // margin-right: 10px;
      text-align: center;
      // font-weight: bold;
    }

    .button {
      flex: 1;
      display: inline-block;
      border: 0;
      border-left: 1px solid black;
      border-radius: var(--border-radius) 0 0 var(--border-radius);

      &:not(:first-of-type) {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
      }
    }
  }

  &.closed {
    height: 0;
  }

  &.grid {
    display: grid;
    grid-template-columns: 1fr .5fr .5fr
  }

  button {
    display: flex;
    border: 1px solid black;
    border-radius: var(--border-radius);
    user-select: none;
    padding: 0 .25rem;
    transition: background-color .5s linear;

    &.excluded {
      background-color: hsl(0, 0%, 50%)
    }

    &.enabled {
      background-color: hsl(113, 50%, 50%)
    }

    &.disabled {
      background-color: hsl(0, 100%, 60%)
    }
  }

}
</style>