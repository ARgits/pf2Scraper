import type { generalContent } from "@types";
import { defineStore } from "pinia";
import {  reactive, ref, type Ref } from "vue";
import { useContentStore } from "./content";
import { devLog } from "@/utils";
import { useRoute } from "vue-router";

export const useFavoritesStore = defineStore("favorites", () => {
    const route = useRoute()
    const localStorageRef: Ref<({ id: generalContent["id"], type: generalContent["data_type"] } | { id: generalContent["id"] })[]> = ref(localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")!) : [])

    const data = reactive([])
    function hasItemById(itemId: generalContent["id"]) {
        return localStorageRef.value.find((v) => {
            if (typeof v === "string") {
                return v === itemId
            } else {
                return v.id === itemId
            }
        })
    }
    function addRemoveItem(itemId: generalContent["id"]) {
        if (localStorage) {
            const index = localStorageRef.value.findIndex((val) => {
                if (typeof val === "string") {
                    return val === itemId
                } else return val.id === itemId
            })
            if (index === -1) {
                localStorageRef.value.push({ id: itemId })
                devLog('Favorite add item')

            } else {
                localStorageRef.value.splice(index, 1)
                devLog('Favorites remove item')

            }
            localStorage.setItem("favorites", JSON.stringify(localStorageRef.value))
            if ((route.name as string).includes('favorite')) {
                const { getData } = useContentStore()
                getData().then(()=>devLog('Favorite remove item'))
            }
        }
    }
    return { data, addRemoveItem, hasItemById }

})