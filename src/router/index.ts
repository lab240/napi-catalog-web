import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SensorDetailOld from '@/components/SensorDetailOld.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sensor/:model',
      component: SensorDetailOld,
      props: true
    }
  ]
})

export default router
