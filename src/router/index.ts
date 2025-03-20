import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '@/views/LandingPage.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'homepage', component: LandingPage, meta: { requiresAuth: true } },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('@/views/AnalyticsPage.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: 'user',
        name: 'user-management',
        component: () => import('@/views/manage-user/UserList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'user/create',
        name: 'create-user',
        component: () => import('@/views/manage-user/CreateUser.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'user/edit/:id',
        name: 'edit-user',
        component: () => import('@/views/manage-user/EditUser.vue'),
        sensitive: true,
        meta: { requiresAuth: true },
      },

      {
        path: 'product',
        name: 'product-management',
        component: () => import('@/views/manage-product/ProductList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'product/create',
        name: 'create-product',
        component: () => import('@/views/manage-product/CreateProduct.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'product/edit/:id',
        name: 'edit-product',
        component: () => import('@/views/manage-product/EditProduct.vue'),
        sensitive: true,
        meta: { requiresAuth: true },
      },
      {
        path: 'order',
        name: 'order-management',
        component: () => import('@/views/manage-order/OrderList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payment',
        name: 'payment-management',
        component: () => import('@/views/manage-payment/PaymentList.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/LoginPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
