<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios'
import type { AxiosError } from 'axios'

import { serverUrl } from '../utils/service.ts'
import { token, usernameLoggedIn } from '../utils/storage.ts'

import BiArrowLeft from 'bootstrap-icons/icons/arrow-left.svg?component'
import BiInfoCircle from 'bootstrap-icons/icons/info-circle.svg?component'
import BiSend from 'bootstrap-icons/icons/send.svg?component'
import BiX from 'bootstrap-icons/icons/x.svg?component'

const router = useRouter()

const username = ref(usernameLoggedIn.value)
const password = ref('')

const errorMessage = ref('')

const { execute, isLoading } = useAxios(serverUrl, {
  method: 'POST'
}, {
  immediate: false,
  resetOnExecute: true,
  onSuccess: (data) => {
    token.value = data.token
    router.replace('/')
  },
  onError: (error) => {
    const response = (error as AxiosError).response

    if (response) {
      if (response.status === 401) {
        errorMessage.value = 'Invalid password'
      } else if (response.status === 404) {
        errorMessage.value = 'Unsupported username'
      } else {
        errorMessage.value = `Error (${response.status} ${response.statusText})`
        console.error(response)
      }
    } else {
      console.error(error)
      errorMessage.value = 'Network error'
    }
  }
})

const onSubmit = () => {
  execute({
    data: {
      username: username.value,
      password: password.value
    }
  })
}

const onCancel = () => {
  router.replace('/')
}
</script>

<template>
  <form
    class="flex flex-col items-stretch justify-center px-1 pt-20 gap-4"
    @submit.prevent="onSubmit"
  >
    <h1 class="text-gray-800 dark:text-gray-200 text-4xl font-bold text-center">BJUT OTP</h1>

    <div class="flex bg-gray-50 dark:bg-gray-800 border border-gray-300 text-gray-600 rounded-lg p-4 gap-2 dark:text-gray-300 dark:border-gray-600">
      <bi-info-circle class="flex-none w-4 h-4 mt-0.5" />
      <p class="flex-1 text-xs">
        This is a third-party implementation of the OTP method used by BJUT VPN. If you have registered your secret, please login using your CAS credentials; if not, please contact <strong>@JingBh</strong> for details.
      </p>
    </div>

    <input
      v-model="username"
      type="text"
      class="bg-white border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      name="username"
      placeholder="Username"
      required
      aria-label="Username"
    >

    <input
      v-model="password"
      type="password"
      class="bg-white border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
      name="password"
      placeholder="Password"
      required
      aria-label="Password"
    >

    <p
      v-if="errorMessage"
      class="text-sm text-red-600 dark:text-red-500"
    >
      <bi-x class="inline-block w-4 h-4 mr-1" />
      <span
        class="align-middle"
        v-text="errorMessage"
      />
    </p>

    <div class="flex gap-4">
      <button
        v-if="usernameLoggedIn"
        type="button"
        class="flex-1 py-2.5 px-5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        @click="onCancel"
      >
        <bi-arrow-left class="inline-block w-5 h-4 mr-1" />
        <span>Cancel</span>
      </button>

      <button
        v-if="isLoading"
        type="submit"
        class="flex-1 text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg px-5 py-2.5 text-center"
        disabled
      >
        Loading...
      </button>
      <button
        v-else
        type="submit"
        class="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <bi-send class="inline-block w-5 h-4 mr-1" />
        <span>Login</span>
      </button>
    </div>
  </form>
</template>
