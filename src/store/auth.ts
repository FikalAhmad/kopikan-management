import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { User } from '@/types/auth.types'
import { jwtDecode } from 'jwt-decode'
import { axiosJWT } from '@/lib/axios'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!user.value)

    // Actions
    const login = async (email: string, password: string) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_USER}/api/login`,
          {
            email,
            password,
          },
          { withCredentials: true },
        )

        if (response.data) {
          const decoded = jwtDecode<User>(response.data.accessToken)
          token.value = response.data.accessToken
          user.value = decoded
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    const logout = () => {
      axiosJWT.patch('/api/logout')
      token.value = null
      user.value = null
      window.location.href = '/'
    }

    const refreshToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_USER}/api/token`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        const decoded = jwtDecode<User>(response.data.accessToken)

        token.value = response.data.accessToken
        user.value = decoded

        return response.data.accessToken
      } catch (error) {
        console.error('Token refresh failed:', error)
        logout()
        return null
      }
    }

    return { user, token, isAuthenticated, login, logout, refreshToken }
  },
  {
    persist: {
      key: 'auth',
      storage: sessionStorage,
    },
  },
)
