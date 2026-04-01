import { axiosJWT } from '@/lib/axios'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type QueryParams = {
  page?: string
  pageSize?: string
}

export const useOrderStore = defineStore(
  'order',
  () => {
    const orders = ref<{
      success: boolean
      data: {
        id: string
        customerid: string
        order_date: string
        order_source: string
        delivery_address?: string
        total: string
        status: string
      }[]
      pagination: {
        total: number
        page: number
        pageSize: number
        totalPages: number
      }
    }>()

    const fetchOrders = async ({ page = '1', pageSize = '10' }: QueryParams = {}) => {
      try {
        const response = await axiosJWT.get(`/api/orders?page=${page}&pageSize=${pageSize}`)
        if (response.data) {
          orders.value = response.data
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    const createOrder = async (orderData: { name: string; email: string; password: string }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API}/api/orders`, orderData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        if (response.data) {
          fetchOrders()
          window.location.href = '/order'
        }
      } catch (error) {
        console.error('Error creating order:', error)
      }
    }

    const updateOrder = async (
      id: string,
      orderData: { name: string; email: string; password: string },
    ) => {
      try {
        const response = await axiosJWT.patch(`/api/orders/${id}`, orderData)
        if (response.data) {
          fetchOrders()
          window.location.href = '/order'
        }
      } catch (error) {
        console.error('Error updating order:', error)
      }
    }

    const deleteOrder = async (id: string) => {
      try {
        await axiosJWT.delete(`/api/orders/${id}`)
        fetchOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
      }
    }

    return { orders, fetchOrders, createOrder, updateOrder, deleteOrder }
  },
  {
    persist: {
      key: 'order',
      storage: localStorage,
    },
  },
)
