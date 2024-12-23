import type { generalContent } from "@types";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { devLog } from "@/utils";
import { uuid } from "@electric-sql/pglite";
import { useContentStore } from "./content";
import { Draggable } from "gsap/Draggable";
export const useModalWindows = defineStore('modalWindows', () => {
    const modalData: Ref<Map<generalContent["id"], { show: boolean, data: Pick<generalContent, 'name' | 'original_desc' | 'original_name' | 'aon_url' | 'id' | 'external_ru_url' | 'trait'> | null, name: string }>> = ref(new Map())
    const { getItem } = useContentStore()
    const mapURLtoId: Map<string, generalContent["id"]> = new Map()
    async function addData(id: generalContent["id"] | generalContent["aon_url"] | generalContent["external_ru_url"], name: string) {
        if (modalData.value.has(id) || mapURLtoId.has(id)) {
            return
        }
        const itemData = await getItem(id) ?? { aon_url: id.includes('.aspx') ? id : null, external_ru_url: !id.includes('.aspx') ? id : null }
        devLog('ModalStore.addData:itemData:', itemData)
        const realId = itemData.id ? itemData.id : `id-${uuid()}`
        if (modalData.value.has(realId)) {
            mapURLtoId.set(id, realId)
            return
        }
        modalData.value.set(realId, { show: false, data: itemData, name })
        mapURLtoId.set(id, realId)
    }
    async function showModal(id: generalContent["id"], ev: MouseEvent, name: string) {
        if (!modalData.value.has(id) || !mapURLtoId.has(id)) {
            await addData(id, name)
        }
        const realId = mapURLtoId.get(id)!
        const modalItem = modalData.value.get(realId)!
        devLog('ShowModal: modalItem:', modalItem)
        if (modalItem.show) {
            const draggableModal = Draggable.get(`.modal#${realId}`)
            devLog('Draggable', ev, draggableModal)
            draggableModal.startDrag(ev)
        } else {
            modalData.value.set(realId, { ...modalItem, show: true })
        }
    }
    function closeModal(id: generalContent["id"]) {
        const realId = mapURLtoId.get(id) ?? id
        devLog('CloseModal:realId:', realId)
        const modalItem = modalData.value.get(realId)
        devLog('CloseModal:modalItem:', modalItem)
        if (!modalItem) return
        modalData.value.set(realId, { ...modalItem, show: false })
    }
    return { modalData, addData, showModal, closeModal }
})