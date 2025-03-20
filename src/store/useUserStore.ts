import { axiosJWT } from '@/lib/axios'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const users = ref<{ id: string; name: string; email: string }[]>()

    const fetchUsers = async () => {
      try {
        const response = await axiosJWT.get('/api/users')
        if (response.data) {
          users.value = response.data
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const createUser = async (userData: { name: string; email: string; password: string }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_USER}/api/users`, userData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        if (response.data) {
          fetchUsers()
          window.location.href = '/user'
        }
      } catch (error) {
        console.error('Error creating user:', error)
      }
    }

    const updateUser = async (
      id: string,
      userData: { name: string; email: string; password: string },
    ) => {
      try {
        const response = await axiosJWT.patch(`/api/users/${id}`, userData)
        if (response.data) {
          fetchUsers()
          window.location.href = '/user'
        }
      } catch (error) {
        console.error('Error updating user:', error)
      }
    }

    const deleteUser = async (id: string) => {
      try {
        await axiosJWT.delete(`/api/users/${id}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }

    return { users, fetchUsers, createUser, updateUser, deleteUser }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
    },
  },
)
