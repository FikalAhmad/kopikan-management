import { axiosJWT } from '@/lib/axios'
import type { DiscountProps } from '@/types/discount.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDiscountStore = defineStore(
  'discount',
  () => {
    const discounts = ref<{
      success: boolean
      data: DiscountProps[]
      pagination: {
        total: number
        page: number
        pageSize: number
        totalPages: number
      }
    }>()

    const fetchDiscounts = async ({ page = '1', pageSize = '10' }: QueryParams = {}) => {
      try {
        const response = await axiosJWT.get(`/api/discounts?page=${page}&pageSize=${pageSize}`)
        if (response.data) {
          discounts.value = response.data
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const createDiscount = async (data: Omit<DiscountProps, 'id'>) => {
      try {
        const response = await axiosJWT.post('/api/discounts', data)
        if (response.data) {
          fetchDiscounts()
          window.location.href = '/discount'
        }
      } catch (error) {
        console.error('Error creating discount:', error)
      }
    }

    const updateDiscount = async (id: string, data: Partial<DiscountProps>) => {
      try {
        const response = await axiosJWT.patch(`/api/discounts/${id}`, data)
        if (response.data) {
          fetchDiscounts()
          window.location.href = '/discount'
        }
      } catch (error) {
        console.error('Error updating discount:', error)
      }
    }

    const deleteDiscount = async (id: string) => {
      try {
        await axiosJWT.delete(`/api/discounts/${id}`)
        fetchDiscounts()
      } catch (error) {
        console.error('Error deleting discount:', error)
      }
    }

    return { discounts, fetchDiscounts, createDiscount, updateDiscount, deleteDiscount }
  },
  {
    persist: {
      key: 'discount',
      storage: localStorage,
    },
  },
)
