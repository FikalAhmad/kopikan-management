import { axiosJWT } from '@/lib/axios'
import type { QueryParams } from '@/types/global.types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const users = ref<{
      success: boolean
      data: {
        id: string
        name: string
        email: string
        phone: string
        role_id: string
        role: { role_name: string }
      }[]
      pagination: {
        total: number
        page: number
        pageSize: number
        totalPages: number
      }
    }>()

    const fetchUsers = async ({ page = '1', pageSize = '10' }: QueryParams = {}) => {
      try {
        const response = await axiosJWT.get(`/api/users?page=${page}&pageSize=${pageSize}`)
        if (response.data) {
          users.value = response.data
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const createUser = async (userData: {
      name: string
      email: string
      password: string
      phone: string
      role_id: string
    }) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API}/api/register`,
          userData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        )
        if (response.data) {
          fetchUsers()
          return true
        }
        return false
      } catch (error) {
        console.error('Error creating user:', error)
        return false
      }
    }

    const updateUser = async (
      id: string,
      userData: {
        name?: string
        email?: string
        password?: string
        phone?: string
        role_id?: string
      },
    ) => {
      try {
        const response = await axiosJWT.patch(`/api/users/${id}`, userData)
        if (response.data) {
          fetchUsers()
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating user:', error)
        return false
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
