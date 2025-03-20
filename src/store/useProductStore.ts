import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ProductProps {
  _id: string
  image: string
  title: string
  price: number
  desc: string
  category: string
}

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<ProductProps[]>()

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_PRODUCT}/products`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        if (response.data) {
          products.value = response?.data
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    const createProduct = async (productData: Omit<ProductProps, '_id'>) => {
      try {
        await axios.post(`${import.meta.env.VITE_APP_PRODUCT}/products`, productData)
        fetchProduct()
      } catch (error) {
        console.error('Error creating product:', error)
      }
    }

    const updateProduct = async (_id: string, productData: Omit<ProductProps, '_id'>) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_APP_PRODUCT}/products/${_id}`,
          productData,
        )
        if (response.data) {
          fetchProduct()
          window.location.href = '/product'
        }
      } catch (error) {
        console.error('Error updating product:', error)
      }
    }

    const deleteProduct = async (id: string) => {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_PRODUCT}/products/${id}`)
        fetchProduct()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }

    return { products, fetchProduct, createProduct, updateProduct, deleteProduct }
  },
  {
    persist: {
      key: 'product',
      storage: localStorage,
    },
  },
)
