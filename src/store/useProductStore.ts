import { axiosJWT } from '@/lib/axios'
import type { ProductInput, ProductProps } from '@/types/product.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<ProductProps[]>()

    const fetchProduct = async () => {
      try {
        const response = await axiosJWT.get('/api/products')
        if (response.data) {
          products.value = response?.data.data
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    const createProduct = async (productData: ProductInput) => {
      try {
        await axiosJWT.post('/api/products', productData)
        fetchProduct()
      } catch (error) {
        console.error('Error creating product:', error)
      }
    }

    const updateProduct = async (id: string, productData: Partial<ProductInput>) => {
      try {
        const response = await axiosJWT.patch(`/api/products/${id}`, productData)
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
        await axiosJWT.delete(`/api/products/${id}`)
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
