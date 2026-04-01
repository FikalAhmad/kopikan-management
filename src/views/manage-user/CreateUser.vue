<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { axiosJWT } from '@/lib/axios'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const userStore = useUserStore()
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1).max(100),
    password: z.string().min(5, { message: 'Password must be 5 or more characters long' }).max(100),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(1).max(15),
    role_id: z.string().min(1).max(100),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const roleData = ref<Array<{ id: string; role_name: string }>>([])

const onSubmit = form.handleSubmit((values) => {
  userStore.createUser(values)
})

onMounted(async () => {
  try {
    const response = await axiosJWT.get('/api/roles')
    if (response.data) {
      roleData.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
})
</script>
<template>
  <Card class="m-5">
    <CardHeader>
      <CardTitle>Create User</CardTitle>
      <CardDescription>Add user here</CardDescription>
    </CardHeader>
    <ScrollArea class="h-96">
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter user name here"></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input v-bind="componentField" type="email" placeholder="Enter user email here">
                </Input>
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
                  placeholder="Enter user password here"
                >
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
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="role in roleData" :key="role.id" :value="role.id">{{
                        role.role_name
                      }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit">Create User</Button>
        </form>
      </CardContent>
    </ScrollArea>
  </Card>
</template>
