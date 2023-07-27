<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { useAxios } from '@vueuse/integrations/useAxios'

import { serverUrl } from '../utils/service.ts'
import { token, usernameLoggedIn } from '../utils/storage.ts'
import DashboardProgress from '../components/DashboardProgress.vue'

import BiArrowClockwise from 'bootstrap-icons/icons/arrow-clockwise.svg?component'
import BiGit from 'bootstrap-icons/icons/git.svg?component'
import BiRepeat from 'bootstrap-icons/icons/repeat.svg?component'

const router = useRouter()

const code = ref('')
const validity = ref(0)

const digits = computed(() => {
  return (code.value || '------').split('')
})

const { execute, isLoading } = useAxios(serverUrl, {
  method: 'GET'
}, {
  immediate: false,
  resetOnExecute: true,
  onSuccess: (data) => {
    code.value = data.code
    validity.value = data.remaining_time
    resume()
  },
  onError: (error) => {
    console.error(error)
    router.replace('/login')
  }
})

const refresh = () => {
  if (!token.value) {
    router.replace('/login')
    return
  }

  execute({
    params: {
      username: usernameLoggedIn.value
    },
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
}

const { pause, resume } = useIntervalFn(() => {
  validity.value -= 1

  if (validity.value <= 0) {
    pause()
    refresh()
  }
}, 1000, {
  immediate: false
})

onMounted(() => {
  refresh()
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-4">
    <h1 class="text-gray-800 dark:text-gray-200 text-4xl font-bold text-center">BJUT OTP</h1>

    <p class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <span
        v-if="usernameLoggedIn"
        class="text-lg"
      >
        Logged in as <span class="font-mono select-all">{{ usernameLoggedIn }}</span>
      </span>
      <span
        v-else
        class="text-lg"
      >
        Not logged in
      </span>
      <bi-repeat
        class="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        aria-label="Switch account"
        @click="router.replace('/login')"
      />
    </p>

    <div class="w-full inline-flex items-center justify-center overflow-hidden rounded-full">
      <dashboard-progress
        class="w-full"
        :percentage="validity / 60 * 100"
        :trail-width="3"
        :stroke-width="3"
        trail-class="stroke-gray-300 dark:stroke-gray-700"
        stroke-class="stroke-orange-500 dark:stroke-orange-400 !ease-linear !duration-1000"
      />

      <div
        class="absolute inline-flex font-code text-5xl gap-4 select-all"
        aria-label="The code"
      >
        <span
          v-for="(digit, i) in digits"
          :key="i"
          v-text="digit"
        />
      </div>
    </div>

    <p
      v-if="isLoading"
      class="text-sm text-gray-500"
    >
      <bi-arrow-clockwise class="inline-block w-4 h-4 mr-1" />
      <span class="align-middle">Refreshing...</span>
    </p>
    <p
      v-else-if="validity"
      class="text-sm text-gray-500"
    >
      <bi-arrow-clockwise class="inline-block w-4 h-4 mr-1" />
      <span class="align-middle">Refresh after {{ validity }} seconds</span>
    </p>
    <p
      v-else
      class="text-sm text-gray-500"
    >
      Loading...
    </p>

    <div class="flex text-xs text-gray-400 dark:text-gray-600 text-center gap-1 items-center">
      <bi-git class="w-3 h-3" />
      Source (<a class="hover:underline" href="https://github.com/bjut-tech/otp-web.git" target="_blank">Web</a>, <a class="hover:underline" href="https://github.com/bjut-tech/otp.git" target="_blank">Backend</a>)
    </div>
  </div>
</template>
