import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref('success') // 'success', 'error', 'info'

  const showToast = (msg, toastType = 'success', duration = 3000) => {
    message.value = msg
    type.value = toastType
    show.value = true
    
    setTimeout(() => {
      show.value = false
    }, duration)
  }

  return { show, message, type, showToast }
})
