import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '@/views/LandingPage.vue'

const routes = [
  { path: '/', name: 'homepage', component: LandingPage },
  { path: '/login', name: 'login', component: () => import('@/views/LoginPage.vue') },
  { path: '/analytics', name: 'analytics', component: () => import('@/views/AnalyticsPage.vue') },
  {
    path: '/user',
    name: 'user-management',
    component: () => import('@/views/management/UserPage.vue'),
  },
  {
    path: '/product',
    name: 'product-management',
    component: () => import('@/views/management/ProductPage.vue'),
  },
  {
    path: '/order',
    name: 'order-management',
    component: () => import('@/views/management/OrderPage.vue'),
  },
  {
    path: '/payment',
    name: 'payment-management',
    component: () => import('@/views/management/PaymentPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
