import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '@/views/LandingPage.vue'

const routes = [
  { path: '/', name: 'homepage', component: LandingPage },
  { path: '/login', name: 'login', component: () => import('@/views/LoginPage.vue') },
  { path: '/analytics', name: 'analytics', component: () => import('@/views/AnalyticsPage.vue') },

  {
    path: '/user',
    name: 'user-management',
    component: () => import('@/views/manage-user/UserList.vue'),
  },
  {
    path: '/user/create',
    name: 'create-user',
    component: () => import('@/views/manage-user/CreateUser.vue'),
  },
  {
    path: '/user/edit:id',
    name: 'edit-user',
    component: () => import('@/views/manage-user/EditUser.vue'),
  },

  {
    path: '/product',
    name: 'product-management',
    component: () => import('@/views/manage-product/ProductList.vue'),
  },
  {
    path: '/order',
    name: 'order-management',
    component: () => import('@/views/manage-order/OrderList.vue'),
  },
  {
    path: '/payment',
    name: 'payment-management',
    component: () => import('@/views/manage-payment/PaymentList.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
