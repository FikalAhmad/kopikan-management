import { useAuthStore } from '@/store/auth'
import type { User } from '@/types/auth.types'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const baseURL = import.meta.env.VITE_APP_USER

export const axiosJWT = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosJWT.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore()
    const { token, refreshToken } = authStore

    if (token) {
      const decoded = jwtDecode(token) as User
      if (decoded.exp * 1000 < Date.now()) {
        try {
          const newToken = await refreshToken()
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          return Promise.reject(error)
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosJWT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const { logout } = authStore
    if (error.response?.status === 401) {
      console.warn('Unauthorized request, logging out...')
      logout()
    }
    return Promise.reject(error)
  },
)
