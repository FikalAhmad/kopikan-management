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
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/store/useProductStore'

const route = useRoute()
const productStore = useProductStore()
const userId = route.params.id as string

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

onMounted(() => {
  const product = productStore.products?.find((u) => u._id === userId)
  if (product) {
    formData.image = product.image
    formData.title = product.title
    formData.price = product.price
    formData.desc = product.desc
    formData.category = product.category
  } else {
    console.log('gaada')
  }
})
const handleSubmit = () => {
  productStore.updateProduct(userId, formData)
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
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Edit Product here</CardDescription>
      </CardHeader>
      <CardContent class="h-[60vh] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput v-model="formData.image" placeholder="Enter your image here" type="url">
            <FormLabel>Image</FormLabel>
            <img v-if="formData.image" :src="formData.image" :alt="formData.title" class="w-20" />
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
          <Button class="w-full" type="submit">Edit Product</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
