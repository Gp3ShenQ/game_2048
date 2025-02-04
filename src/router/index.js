import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/layouts/layout.vue'

const routes = [
  {
    path: '',
    component: layout,
  },
]

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
})

export default router
