import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { titleZh: 'MySQL2PG - 高性能 MySQL 到 PostgreSQL 迁移工具', titleEn: 'MySQL2PG - High-Performance MySQL to PostgreSQL Migration Tool' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesPage.vue'),
    meta: { titleZh: '开源版与商业版 - MySQL2PG', titleEn: 'Open Source & Commercial - MySQL2PG' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactPage.vue'),
    meta: { titleZh: '联系我们 - MySQL2PG', titleEn: 'Contact Us - MySQL2PG' },
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('../views/FAQPage.vue'),
    meta: { titleZh: '常见问题 - MySQL2PG', titleEn: 'FAQ - MySQL2PG' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/NotFoundPage.vue'),
    meta: { titleZh: '页面未找到 - MySQL2PG', titleEn: 'Page Not Found - MySQL2PG' },
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

router.afterEach((to) => {
  window.__router_current_meta = to.meta
  const lang = localStorage.getItem('mysql2pg-lang') || 'zh'
  const title = lang === 'en' ? to.meta.titleEn : to.meta.titleZh
  if (title) document.title = title
})

export default router
