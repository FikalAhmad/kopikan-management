<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formLoginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  }),
)
const formLogin = useForm({
  validationSchema: formLoginSchema,
})

const authStore = useAuthStore()

const onSubmit = formLogin.handleSubmit((values) => {
  authStore.login(values.email, values.password)
})
</script>

<template>
  <Card class="w-full max-w-96">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Loginkan</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                placeholder="Enter your email here"
                class="border p-2 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                placeholder="Enter your password here"
                class="border p-2 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button class="w-full" type="submit">Login</Button>
      </form>
    </CardContent>
  </Card>
</template>
