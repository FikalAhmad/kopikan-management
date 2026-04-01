<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const route = useRoute()
const userStore = useUserStore()
const userId = route.params.id as string

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1).max(100).optional(),
    password: z
      .string()
      .min(5, { message: 'Password must be 5 or more characters long' })
      .max(100)
      .optional(),
    phone: z.string().min(1).max(15).optional(),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

onMounted(() => {
  const user = userStore.users?.find((u) => u.id === userId)
  if (user) {
    form.setValues(user)
  }
})

const onSubmit = form.handleSubmit((values) => {
  userStore.updateUser(userId, values)
})
</script>
<template>
  <Card class="m-5">
    <CardHeader>
      <CardTitle>Edit User</CardTitle>
      <CardDescription>Edit user here</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Enter user name here"> </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                v-bind="componentField"
                type="email"
                placeholder="Enter user email here"
                disabled
              >
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="password" placeholder="Enter user password here">
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="text" placeholder="Enter user phone here">
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="role_id">
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Select v-bind="componentField" disabled>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="67e3011960094b86083ac359">Admin</SelectItem>
                    <SelectItem value="6800a52eea8560606cbc4a25">Customer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <Button class="w-full" type="submit">Edit User</Button>
      </form>
    </CardContent>
  </Card>
</template>
