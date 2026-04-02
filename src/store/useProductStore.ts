import { axiosJWT } from '@/lib/axios'
import type { QueryParams } from '@/types/global.types'
import type { ProductInput, ProductProps } from '@/types/product.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<{
      success: boolean
      data: ProductProps[]
      pagination: {
        total: number
        page: number
        pageSize: number
        totalPages: number
      }
    }>()

    const fetchProduct = async ({ page = '1', pageSize = '10' }: QueryParams = {}) => {
      try {
        const response = await axiosJWT.get(`/api/products?page=${page}&pageSize=${pageSize}`)
        if (response.data) {
          products.value = response?.data
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
