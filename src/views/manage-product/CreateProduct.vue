<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponent'
import { FormInput, FormLabel } from '@/components/ui/FormComponent'
import { Button } from '@/components/ui/ButtonComponent'
import { reactive } from 'vue'
import { useProductStore } from '@/store/useProductStore'

const formData = reactive<{
  image: string
  title: string
  price: number
  desc: string
  category: string
}>({
  image: '',
  title: '',
  price: 0,
  desc: '',
  category: '',
})

const productStore = useProductStore()

const addUser = async () => {
  try {
    productStore.createProduct(formData)
  } catch (error) {
    console.error(error)
  }
}
const handleSubmit = () => {
  addUser()
  formData.image = ''
  formData.title = ''
  formData.price = 0
  formData.desc = ''
  formData.category = ''
}
</script>
<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">Product Management</div>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Add Product here</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput v-model="formData.image" placeholder="Enter your image here" type="file">
            <FormLabel>Image</FormLabel>
          </FormInput>
          <FormInput v-model="formData.title" placeholder="Enter product name here">
            <FormLabel>Product Name</FormLabel>
          </FormInput>
          <FormInput v-model="formData.price" type="number" placeholder="Enter product price here">
            <FormLabel>Price</FormLabel>
          </FormInput>
          <FormInput v-model="formData.desc" placeholder="Enter product description here">
            <FormLabel>Description</FormLabel>
          </FormInput>
          <FormInput v-model="formData.category" placeholder="Enter product category here">
            <FormLabel>Category</FormLabel>
          </FormInput>
          <Button class="w-full" type="submit">Create Product</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
