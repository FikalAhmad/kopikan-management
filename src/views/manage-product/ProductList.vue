<!-- App.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Product Management</h1>

    <!-- Form Tambah/Edit -->
    <div class="mb-6 p-4 border rounded bg-white shadow">
      <h2 class="text-xl mb-3">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Image URL:</label>
          <input
            v-model="formData.image"
            type="url"
            class="border p-2 w-full rounded"
            placeholder="https://example.com/image.jpg"
            required
          />
          <!-- Preview Image -->
          <img
            v-if="formData.image"
            :src="formData.image"
            class="mt-2 h-32 object-cover rounded"
            alt="Preview"
          />
        </div>
        <div>
          <label class="block mb-1">Title:</label>
          <input v-model="formData.title" type="text" class="border p-2 w-full rounded" required />
        </div>
        <div>
          <label class="block mb-1">Price:</label>
          <input
            v-model="formData.price"
            type="number"
            step="0.01"
            class="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label class="block mb-1">Category:</label>
          <select v-model="formData.category" class="border p-2 w-full rounded" required>
            <option value="">Select Category</option>
            <option value="signature">signature</option>
            <option value="coffee">coffee</option>
            <option value="non-coffee">non-coffee</option>
          </select>
        </div>
        <div>
          <label class="block mb-1">desc:</label>
          <textarea
            v-model="formData.desc"
            class="border p-2 w-full rounded h-24"
            required
          ></textarea>
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            type="button"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border bg-white shadow">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Image</th>
            <th class="border p-2">Title</th>
            <th class="border p-2">Price</th>
            <th class="border p-2">Category</th>
            <th class="border p-2">desc</th>
            <th class="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td class="border p-2 w-32">
              <img
                :src="product.image"
                :alt="product.title"
                class="h-24 w-24 object-cover rounded"
              />
            </td>
            <td class="border p-2">{{ product.title }}</td>
            <td class="border p-2">${{ product.price.toFixed(2) }}</td>
            <td class="border p-2">{{ product.category }}</td>
            <td class="border p-2">
              <div class="max-h-24 overflow-y-auto">
                {{ product.desc }}
              </div>
            </td>
            <td class="border p-2">
              <button
                @click="editProduct(product)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product._id)"
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// State
const products = ref<
  {
    _id: string
    image: string
    title: string
    price: number
    category: string
    desc: string
  }[]
>([])
const isEditing = ref(false)
const editingId = ref('')
const apiUrl = 'https://mongokopikan.vercel.app/products'

const formData = reactive<{
  image: string
  title: string
  price: number
  category: string
  desc: string
}>({
  image: '',
  title: '',
  price: 0,
  category: '',
  desc: '',
})

// Methods
const fetchProducts = async () => {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    products.value = data
  } catch (error) {
    console.error('Error fetching products:', error)
    alert('Failed to fetch products')
  }
}

const addProduct = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      await fetchProducts()
      resetForm()
      alert('Product added successfully')
    }
  } catch (error) {
    console.error('Error adding product:', error)
    alert('Failed to add product')
  }
}

const updateProduct = async () => {
  try {
    const response = await fetch(`${apiUrl}/${editingId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      await fetchProducts()
      resetForm()
      alert('Product updated successfully')
    }
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Failed to update product')
  }
}

const deleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProducts()
        alert('Product deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }
}

const handleSubmit = () => {
  if (isEditing.value) {
    updateProduct()
  } else {
    addProduct()
  }
}

const editProduct = (product: {
  _id: string
  image: string
  title: string
  price: number
  category: string
  desc: string
}) => {
  isEditing.value = true
  editingId.value = product._id
  Object.assign(formData, product)
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.image = ''
  formData.title = ''
  formData.price = 0
  formData.category = ''
  formData.desc = ''
  isEditing.value = false
  editingId.value = ''
}

// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>
