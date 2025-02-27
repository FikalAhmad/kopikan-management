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

const formData = reactive<{
  name: string
  email: string
  password: string
}>({
  name: '',
  email: '',
  password: '',
})

const editUser = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_APP_USER, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert('User updated successfully')
    }
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user')
  }
}

const handleSubmit = () => {
  editUser()
  formData.name = ''
  formData.email = ''
  formData.password = ''
}
</script>
<template>
  <div class="mx-10 mt-5">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">User Management</div>
    </div>
    <Card class="mt-10">
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
        <CardDescription>Edit user here</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput v-model="formData.name" placeholder="Enter user name here">
            <FormLabel>Name</FormLabel>
          </FormInput>
          <FormInput v-model="formData.email" type="email" placeholder="Enter user email here">
            <FormLabel>Email</FormLabel>
          </FormInput>
          <FormInput
            v-model="formData.password"
            type="password"
            placeholder="Enter user password here"
          >
            <FormLabel>Password</FormLabel>
          </FormInput>
          <Button class="w-full">Create User</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
