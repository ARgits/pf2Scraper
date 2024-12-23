<script setup lang="ts">
import { devLog } from '@/utils'
import { useModalWindows } from '@stores/modalWindows'
import type { generalContent } from '@types'
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, type Ref, watch } from 'vue'

const props = defineProps<{ description: generalContent['description'] }>()
const descRef = ref(props.description)
const descComputed = computed(() => props.description)
const descElem: Ref<HTMLElement | null> = ref(null)
const { showModal } = useModalWindows()
// const { globalIndex } = useContentStore()
onMounted(() => {
  createDescHtml()
})

function createDescHtml() {
  const tempDiv = document.createElement('div')
  const isRuDesc = !!props.description.match(/[а-яА-Я]/ms)?.length
  
  const arr = props.description.replace(/(<title.*?level="1".*?<\/title>)|(<\/?column.*?>)/gms, '').split(/\n/gm).filter(v => (v !== ''))
  let notNeededTag = false
  if (!isRuDesc) {
    for (let ind in arr) {
      if (arr[ind].includes('<traits')) {
        notNeededTag = true
        arr[ind] = ''
        continue
      }
      if ((arr[ind].includes('</traits')) && notNeededTag) {
        notNeededTag = false
        arr[ind] = ''
        continue
      }
      if (notNeededTag) {
        arr[ind] = ''
        continue
      }
      if (arr[ind] === '---') {
        arr[ind] = ''
        continue
      }
      
      arr[ind] = arr[ind]
        .trim()
        .replace(/<title level="(\d)".+?>(.+?)<\/title>/gms, (_, p1, p2) => `<h${p1} class='title'>${p2}</h${p1}>`)
        .replace(/(#{1,6})(.+)/gm, (_, p1, p2) => `<h${p1.length}>${p2.trim()}</h${p1.length}>`)
        .replace(/(^[^<].+)/gm, (_, p1) => `<p>${p1}</p>`)
        .replace(/(\*\*)(.+?)(\*\*)/gm, (_, __, p2, ___) => `<strong>${p2}:</strong>`)
        .replace(/<actions string="(.+?)" \/>/gms, (_, p1) => {
          const src = p1 === 'Single Action' ?
            'PF_action_1.webp'
            : p1 === 'Reaction'
              ? 'PF_action_reaction.webp' : p1 === 'Free Action'
                ? 'PF_action_free.webp' : p1 === 'Two Actions'
                  ? 'PF_action_2.webp' : 'PF_action_3.webp';
          return `<img src="${src}" style="height:1em;" />`
        })
        .replace(/\[(.+?)]\((.+?)\)/gm, (_, p1, p2) =>

          p2.match(/\.aspx\?ID=[0-9]{1,4}/gm) ? `<button data-id="https://2e.aonprd.com${p2}" data-name="${p1}" aria-label="open ${p1} description in modal window">${p1} </button>` : `<em>${p1}</em>`)
    }
  }
  tempDiv.innerHTML = isRuDesc ? props.description : arr.filter(r => r.length).join('')
  // for (const elem of tempDiv.querySelectorAll('[data-id]') as NodeListOf<HTMLElement>) {
  //   // 
  //   // const item = globalIndex[elem.dataset.id!]
  //   // if (item)
  //   
  //   elem.outerHTML = `<button data-id="${elem.dataset.id}" data-name=${elem.dataset.name} aria-label="open ${elem.dataset.name} description in modal window"" >${elem.outerHTML}</button>`
  // }

  descRef.value = tempDiv.innerHTML
  if (!descElem.value) return
  nextTick().then(() => {
    // 
    for (const button of descElem.value!.querySelectorAll<HTMLButtonElement & { dataset: { id: string, name: string } }>('button[data-id][data-name]')) {
      useEventListener(button, 'click', (ev) => {
        devLog('modal window click', button.dataset.id)
        showModal(button.dataset.id as generalContent['id'], ev, button.dataset.name)
      })
    }

  })

}

watch(descComputed, async () => {
  createDescHtml()
  await nextTick()
})
</script>
<template>
  <div
    ref="descElem"
    class="description"
    v-html="descRef"
  />
</template>
<style scoped lang="scss">
.description {
  overflow-y: auto;
  scrollbar-gutter: stable;

  & :global(button[data-id]) {
    padding: 0 0.25rem;
    background: rgba(grey, 0.25);
  }
}

p {
  color: transparent;
}
</style>