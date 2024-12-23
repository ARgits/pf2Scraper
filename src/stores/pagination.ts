import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useContentStore } from "./content";
import { useRoute } from "vue-router";
import { devLog } from '@/utils.ts'

export const usePaginationStore = defineStore("pagination", () => {
    const currentPage = ref(0)
    const itemsPerPage = ref(50)
    const route = useRoute()
    const routeName = computed(() => route.name)
    function changePage(numOfPage: number, needDataQuery: boolean = true) {
        if (numOfPage < 0) {
            currentPage.value = 0
            return
        }
        if (numOfPage >= numOfPages.value) {
            currentPage.value = numOfPages.value - 1
            return
        }
        currentPage.value = numOfPage
        if (needDataQuery) {
            const { getData } = useContentStore()
            getData().then(()=>devLog('Change page'))
        }
    }
    const numOfPages = computed(() => {
        const { numOfItems, isDataFetched } = useContentStore()
        if (isDataFetched) {
            
            return Math.ceil(numOfItems / itemsPerPage.value)
        }
        return 0
    })
    const pages = computed(() => {
        const totalPages = numOfPages.value;
        const current = currentPage.value;
        const result: (number | "...")[] = [];

        if (totalPages <= 1) {
            return result; // Return early if there's only one page or none
        }

        // Always include the first two pages
        for (let i = 0; i < Math.min(2, totalPages); i++) {
            result.push(i);
        }

        // Add ellipsis if necessary
        if (current > 3) {
            result.push("...");
        }

        // Add current page and surrounding pages
        const low = Math.max(2, current - 2);
        const high = Math.min(totalPages - 3, current + 2);

        for (let i = low; i <= high; i++) {
            result.push(i);
        }

        // Add ellipsis if necessary
        if (high < totalPages - 3) {
            result.push("...");
        }

        // Always include the last two pages
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
            result.push(i);
        }

        return result;
    })
    watch(numOfPages,()=>{if(currentPage.value>=(numOfPages.value-1))changePage(0,true)})
    watch([routeName,], ([newRoute], [oldRoute]) => { changePage(0, newRoute === oldRoute) })

    return { currentPage, itemsPerPage, numOfPages, changePage, pages }
})