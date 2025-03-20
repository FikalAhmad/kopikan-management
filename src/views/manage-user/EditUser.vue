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
import { useUserStore } from '@/store/useUserStore'

const route = useRoute()
const userStore = useUserStore()
const userId = route.params.id as string

const formData = reactive<{
  name: string
  email: string
  password: string
}>({
  name: '',
  email: '',
  password: '',
})

onMounted(() => {
  const user = userStore.users?.find((u) => u.id === userId)
  if (user) {
    formData.name = user.name
    formData.email = user.email
  }
})

const handleSubmit = () => {
  userStore.updateUser(userId, formData)
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
          <FormInput
            v-model="formData.email"
            type="email"
            placeholder="Enter user email here"
            disabled
          >
            <FormLabel>Email</FormLabel>
          </FormInput>
          <FormInput
            v-model="formData.password"
            type="password"
            placeholder="Enter user password here"
          >
            <FormLabel>Password</FormLabel>
          </FormInput>
          <Button class="w-full" type="submit">Edit User</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
