import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import Index from './pages/Index.vue'
import Login from './pages/Login.vue'

import './style.css'
import { useDark } from '@vueuse/core'

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')

useDark()
