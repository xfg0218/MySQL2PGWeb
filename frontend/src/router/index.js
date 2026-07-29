import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesPage.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactPage.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('../views/FAQPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80,
      }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
