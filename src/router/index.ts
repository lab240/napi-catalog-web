import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SensorDetail from '@/views/sensor/SensorDetail.vue'

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
      name: 'sensor',
      component: SensorDetail,
      props: true
    }
  ]
})

export default router
