<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
const reloadSW: any = 'true'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  // immediate: true,
  onRegisteredSW(swUrl, r) {
    
    if (reloadSW === 'true') {
      r && setInterval(async () => {
        
        await r.update()
      }, 200000)
    }
    else {
      
    }
  },
})

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        Доступно обновление
      </span>
    </div>
    <button
      v-if="needRefresh"
      @click="updateServiceWorker()"
    >
      Обновить
    </button>
    <button @click="close">
      Закрыть (сообщение появится повторно при следующем открытии/перезагрузке сайта)
    </button>
  </div>
</template>

<style lang="scss" scoped>
.pwa-toast {
  position: absolute;
  right: 50%;
  bottom: 50%;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  background: var(--background-image);

  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}

.pwa-toast .message {
  margin-bottom: 8px;
}

.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>