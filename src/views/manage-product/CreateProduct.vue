<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductStore } from '@/store/useProductStore'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref } from 'vue'
import { Label } from '@/components/ui/label'

const productStore = useProductStore()

const formSchema = toTypedSchema(
  z.object({
    product_name: z.string().min(1).max(100),
    image: z.string().min(1).max(100),
    category: z.string().min(1).max(100),
    description: z.string().min(1).max(255),
    price: z.number().lte(1000000),
    options: z
      .array(
        z.object({
          name: z.string().min(1).max(100),
          values: z.array(
            z.object({
              label: z.string().min(1).max(100),
              extra_price: z.number().lte(1000000),
            }),
          ),
        }),
      )
      .optional(),
  }),
)

// State untuk options
const options = ref([
  {
    id: Date.now(),
    name: '',
    values: [
      {
        id: Date.now(),
        label: '',
        extra_price: 0,
      },
    ],
  },
])

const form = useForm({
  validationSchema: formSchema,
})

const addOption = () => {
  options.value.push({
    id: Date.now(),
    name: '',
    values: [
      {
        id: Date.now() + Math.random(),
        label: '',
        extra_price: 0,
      },
    ],
  })
}

const removeOption = (optionIndex: number) => {
  if (options.value.length > 1) {
    options.value.splice(optionIndex, 1)
  }
}

const addValue = (optionIndex: number) => {
  options.value[optionIndex].values.push({
    id: Date.now() + Math.random(),
    label: '',
    extra_price: 0,
  })
}

const removeValue = (optionIndex: number, valueIndex: number) => {
  if (options.value[optionIndex].values.length > 1) {
    options.value[optionIndex].values.splice(valueIndex, 1)
  }
}

const onSubmit = form.handleSubmit((values) => {
  // Filter options yang tidak kosong
  const filteredOptions = options.value
    .filter((option) => option.name.trim() !== '')
    .map((option) => ({
      name: option.name,
      values: option.values.filter((value) => value.label.trim() !== ''),
    }))
    .filter((option) => option.values.length > 0)

  const productData = {
    product_name: values.product_name,
    image: values.image,
    category: values.category,
    description: values.description,
    price: values.price,
    options: filteredOptions.map(
      (option: { name: string; values: { label: string; extra_price: number }[] }) => ({
        name: option.name,
        values: option.values.map((value: { label: string; extra_price: number }) => ({
          label: value.label,
          extra_price: value.extra_price ?? 0,
        })),
      }),
    ),
  }

  productStore.createProduct(productData)
})
</script>
<template>
  <Card class="m-5">
    <CardHeader>
      <CardTitle>Create Product</CardTitle>
      <CardDescription>Add Product here</CardDescription>
    </CardHeader>
    <ScrollArea class="h-[450px]">
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="image">
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter your image here"></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="product_name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter product name here"></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="price">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="Enter product price here"
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter product description here"></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Enter product category here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Signature">Signature</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="NonCoffee">Non Coffee</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <!-- Options Section -->
          <div>
            <h3 class="font-bold mb-2">Options</h3>

            <div
              v-for="(option, optionIndex) in options"
              :key="option.id"
              class="border p-3 mb-3 rounded"
            >
              <!-- Option Name -->
              <div class="mb-3">
                <Label class="block text-sm font-medium mb-1">Option Name</Label>
                <Input
                  v-model="option.name"
                  type="text"
                  placeholder="Size, Ice, Sweetness"
                  class="border p-2 w-full rounded"
                />
              </div>

              <!-- Values -->
              <div class="ml-4 mt-3">
                <h4 class="font-semibold mb-2">Values</h4>

                <div
                  v-for="(value, valueIndex) in option.values"
                  :key="value.id"
                  class="flex gap-2 mb-2"
                >
                  <!-- Label -->
                  <Input
                    v-model="value.label"
                    type="text"
                    placeholder="Regular, Large..."
                    class="border p-2 flex-1 rounded"
                  />

                  <!-- Extra Price -->
                  <Input
                    v-model.number="value.extra_price"
                    type="number"
                    placeholder="0"
                    class="border p-2 w-32 rounded"
                  />

                  <Button
                    type="button"
                    @click="removeValue(optionIndex, valueIndex)"
                    :disabled="option.values.length === 1"
                    size="sm"
                    variant="destructive"
                    class="px-2"
                  >
                    ✕
                  </Button>
                </div>

                <Button
                  type="button"
                  @click="addValue(optionIndex)"
                  size="sm"
                  variant="outline"
                  class="px-2"
                >
                  + Add Value
                </Button>
              </div>

              <Button
                type="button"
                @click="removeOption(optionIndex)"
                :disabled="options.length === 1"
                variant="destructive"
                size="sm"
                class="mt-3 px-2"
              >
                Remove Option
              </Button>
            </div>

            <Button type="button" @click="addOption" variant="outline" size="sm" class="px-3 py-1">
              + Add Option
            </Button>
          </div>

          <Button class="w-full" type="submit">Create Product</Button>
        </form>
      </CardContent>
    </ScrollArea>
  </Card>
</template>
