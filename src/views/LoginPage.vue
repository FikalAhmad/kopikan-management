<template>
  <Card>
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Loginkan</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormInput v-model="loginData.email" type="email" placeholder="Enter your email here">
          <FormLabel>Email</FormLabel>
        </FormInput>
        <FormInput
          v-model="loginData.password"
          type="password"
          placeholder="Enter your password here"
        >
          <FormLabel>Password</FormLabel>
        </FormInput>
        <Button class="w-full" type="submit">Login</Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/ButtonComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponent'
import { FormInput, FormLabel } from '@/components/ui/FormComponent'
import { useAuthStore } from '@/store/auth'
import type { LoginCredentials } from '@/types/auth.types'
import { reactive } from 'vue'

const loginData = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const authStore = useAuthStore()

const handleSubmit = async (): Promise<void> => {
  await authStore.login(loginData.email, loginData.password)
}
</script>
