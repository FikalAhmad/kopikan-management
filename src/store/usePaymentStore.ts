import { axiosJWT } from '@/lib/axios'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore(
  'payment',
  () => {
    const payments = ref<
      {
        id: string
        orderid: string
        payment_date: string
        amount: number
        status: string
        payment_method: string
      }[]
    >()

    const fetchPayments = async () => {
      try {
        const response = await axiosJWT.get('/api/payments')
        if (response.data) {
          payments.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching payments:', error)
      }
    }

    const createPayment = async (paymentData: {
      name: string
      email: string
      password: string
    }) => {
      try {
        const response = await axios.post(`${import.meta.env.API}/api/payments`, paymentData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        if (response.data) {
          fetchPayments()
          window.location.href = '/payment'
        }
      } catch (error) {
        console.error('Error creating payment:', error)
      }
    }

    const updatePayment = async (
      id: string,
      paymentData: { name: string; email: string; password: string },
    ) => {
      try {
        const response = await axiosJWT.patch(`/api/payments/${id}`, paymentData)
        if (response.data) {
          fetchPayments()
          window.location.href = '/payment'
        }
      } catch (error) {
        console.error('Error updating payment:', error)
      }
    }

    const deletePayment = async (id: string) => {
      try {
        await axiosJWT.delete(`/api/payments/${id}`)
        fetchPayments()
      } catch (error) {
        console.error('Error deleting payment:', error)
      }
    }

    return { payments, fetchPayments, createPayment, updatePayment, deletePayment }
  },
  {
    persist: {
      key: 'payment',
      storage: localStorage,
    },
  },
)
