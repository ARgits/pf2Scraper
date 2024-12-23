import { ref, type Ref } from "vue";

export const isMobile = ref(navigator.userAgent.includes('Mobile'))
// window.matchMedia('(max-aspect-ratio:1/1)').addEventListener('change', (ev: MediaQueryListEvent) => {
//     isMobile.value = (ev.currentTarget as MediaQueryList).matches
// })

export const isProd = ref(import.meta.env.PROD)
export const currentMobileMenu: Ref<"content" | "router" | "favorites" | "filterSearch" | "about"> = ref("router")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function devLog(label: string, ...args: any) {
    if (import.meta.env.DEV) {
        console.groupCollapsed(label)
        console.trace(...args)
        console.groupEnd()
    }
}
export function semanticCheck(localVersion: `${number}.${number}.${number}`, lastVesrion: `${number}.${number}.${number}`): -1 | 0 | 1 {
    const localVersionNumbers = localVersion.split('.').map(s => parseInt(s))
    const lastVersionNumbers = lastVesrion.split('.').map(s => parseInt(s))
    for (const ind in localVersionNumbers) {
        const localVersionNum = localVersionNumbers[ind]
        const lastVersionNum = lastVersionNumbers[ind]
        if (lastVersionNum > localVersionNum) {
            return 1
        }
        if (lastVersionNum < localVersionNum) {
            return -1
        }
    }
    return 0
}