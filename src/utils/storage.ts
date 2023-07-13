import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const token = useLocalStorage('token', '')
export const usernameLoggedIn = computed(() => {
  if (token.value) {
    return JSON.parse(atob(token.value.split('.')[1])).username
  }

  return ''
})
