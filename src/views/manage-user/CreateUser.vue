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
import { useUserStore } from '@/store/useUserStore'

const formData = reactive<{
  name: string
  email: string
  password: string
}>({
  name: '',
  email: '',
  password: '',
})

const userStore = useUserStore()

const addUser = async () => {
  try {
    userStore.createUser(formData)
  } catch (error) {
    console.error(error)
  }
}
const handleSubmit = () => {
  addUser()
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
        <CardTitle>Create User</CardTitle>
        <CardDescription>Add user here</CardDescription>
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
          <Button class="w-full" type="submit">Create User</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
