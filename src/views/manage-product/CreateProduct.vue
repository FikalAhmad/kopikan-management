<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ref } from 'vue'
import { useProductStore } from '@/store/useProductStore'
import { useRouter } from 'vue-router'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  PackagePlus,
  Tag,
  DollarSign,
  Layers,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Type,
} from 'lucide-vue-next'

const router = useRouter()
const productStore = useProductStore()
const isSubmitting = ref(false)

const formSchema = toTypedSchema(
  z.object({
    product_name: z.string().min(1, 'Product name is required').max(100),
    image: z.string().min(1, 'Image URL is required').max(255),
    category: z.string().min(1, 'Please select a category'),
    description: z.string().min(1, 'Description is required').max(255),
    price: z.coerce.number().min(0).max(1000000),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    product_name: '',
    image: '',
    category: '',
    description: '',
    price: 0,
  },
})

// State for options (same logic as before, just styled better)
const options = ref([
  {
    id: Date.now(),
    name: '',
    values: [
      {
        id: Date.now() + Math.random(),
        label: '',
        extra_price: 0,
      },
    ],
  },
])

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

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    // Filter non-empty options
    const filteredOptions = options.value
      .filter((option) => option.name.trim() !== '')
      .map((option) => ({
        name: option.name,
        values: option.values.filter((value) => value.label.trim() !== ''),
      }))
      .filter((option) => option.values.length > 0)

    const productData = {
      ...values,
      options: filteredOptions.map((opt) => ({
        name: opt.name,
        values: opt.values.map((v) => ({
          label: v.label,
          extra_price: v.extra_price ?? 0,
        })),
      })),
    }

    await productStore.createProduct(productData)
    router.push('/product')
  } catch (error) {
    console.error('Error creating product:', error)
  } finally {
    isSubmitting.value = false
  }
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="p-6 w-full mx-auto space-y-6 overflow-y-auto">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-10">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          @click="goBack"
          class="rounded-full h-10 w-10 border-muted-foreground/20 hover:bg-muted transition-colors"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Create New Product</h1>
          <p class="text-sm text-slate-500">
            Introduce a new item to your menu with options and variants.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info / Tips Sidebar -->
      <div class="lg:col-span-1 space-y-6 flex flex-col order-2 lg:order-1">
        <Card
          class="overflow-hidden border-none shadow-xl bg-gradient-to-br from-hijau/10 via-white to-white h-full"
        >
          <CardHeader>
            <div
              class="h-16 w-16 rounded-2xl bg-hijau/20 flex items-center justify-center mb-4 border border-hijau/20 shadow-sm transition-transform hover:scale-105 duration-300"
            >
              <PackagePlus class="h-8 w-8 text-hijau" />
            </div>
            <CardTitle class="text-xl font-bold">Product Guide</CardTitle>
            <CardDescription
              >Best practices for showcasing your coffee and food items.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="flex gap-3">
                <div
                  class="mt-1 h-5 w-5 rounded-full bg-hijau/10 flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle2 class="h-3 w-3 text-hijau" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold">High Quality Image</h4>
                  <p class="text-xs text-slate-500">
                    Use clear, high-resolution images for visibility.
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="mt-1 h-5 w-5 rounded-full bg-hijau/10 flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle2 class="h-3 w-3 text-hijau" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold">Descriptive Titles</h4>
                  <p class="text-xs text-slate-500">
                    Make your product names appetizing and clear.
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="mt-1 h-5 w-5 rounded-full bg-hijau/10 flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle2 class="h-3 w-3 text-hijau" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold">Variants & Add-ons</h4>
                  <p class="text-xs text-slate-500">
                    Add customizations like sugar level, ice, or size.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start mt-6"
            >
              <Info class="h-5 w-5 text-hijau mt-0.5" />
              <p class="text-xs text-slate-500 leading-relaxed">
                Products will appear in the customer menu immediately after creation if category is
                active.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Product Form -->
      <Card
        class="lg:col-span-2 shadow-xl border-slate-200 bg-white/50 backdrop-blur-sm order-1 lg:order-2"
      >
        <CardHeader>
          <CardTitle class="text-xl font-bold flex items-center gap-2">
            Product Essentials
          </CardTitle>
          <CardDescription>Fill in the basic info and customize your product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name Field -->
              <FormField v-slot="{ componentField }" name="product_name">
                <FormItem class="md:col-span-2">
                  <FormLabel class="flex items-center gap-2">
                    <Type class="h-4 w-4 text-hijau" />
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="e.g. Arabica Latte"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Image Field -->
              <FormField v-slot="{ componentField }" name="image">
                <FormItem class="md:col-span-2">
                  <FormLabel class="flex items-center gap-2">
                    <ImageIcon class="h-4 w-4 text-hijau" />
                    Image URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="https://example.com/coffee.jpg"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Category Field -->
              <FormField v-slot="{ componentField }" name="category">
                <FormItem>
                  <FormLabel class="flex items-center gap-2">
                    <Layers class="h-4 w-4 text-hijau" />
                    Category
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full bg-white/80 focus:ring-hijautua h-11 shadow-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Signature">Signature</SelectItem>
                          <SelectItem value="Coffee">Coffee</SelectItem>
                          <SelectItem value="NonCoffee">Non Coffee</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Price Field -->
              <FormField v-slot="{ componentField }" name="price">
                <FormItem>
                  <FormLabel class="flex items-center gap-2">
                    <DollarSign class="h-4 w-4 text-hijau" />
                    Base Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="number"
                      placeholder="0"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Description Field -->
              <FormField v-slot="{ componentField }" name="description">
                <FormItem class="md:col-span-2">
                  <FormLabel class="flex items-center gap-2">
                    <FileText class="h-4 w-4 text-hijau" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      placeholder="Describe the taste, ingredients, etc."
                      class="bg-white/80 focus-visible:ring-hijautua min-h-[100px] transition-all resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Dynamic Options Section -->
            <div class="space-y-4 pt-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <Tag class="h-5 w-5 text-hijau" />
                  Product Variants
                </h3>
                <Button
                  type="button"
                  @click="addOption"
                  variant="outline"
                  size="sm"
                  class="border-hijau/20 hover:bg-hijau/10 hover:text-hijau transition-all gap-1 h-9"
                >
                  <Plus class="h-4 w-4" />
                  Add Option
                </Button>
              </div>

              <div class="space-y-6">
                <div
                  v-for="(option, optionIndex) in options"
                  :key="option.id"
                  class="group relative border border-slate-100 bg-slate-50/50 rounded-2xl p-5 md:p-6 transition-all hover:border-hijau/30 hover:shadow-md animate-in fade-in slide-in-from-top-2"
                >
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div class="md:col-span-3 space-y-4">
                      <!-- Option Name -->
                      <div class="space-y-2">
                        <Label class="text-sm font-semibold ml-1">Option Group Name</Label>
                        <Input
                          v-model="option.name"
                          placeholder="e.g. Size, Extra Topping"
                          class="bg-white h-10 border-slate-200 group-hover:border-hijau/20 transition-all"
                        />
                      </div>

                      <!-- Values List -->
                      <div class="space-y-3 mt-4">
                        <Label class="text-sm font-semibold ml-1">Choice Values & Pricing</Label>
                        <div
                          v-for="(value, valueIndex) in option.values"
                          :key="value.id"
                          class="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-left-2"
                        >
                          <Input
                            v-model="value.label"
                            placeholder="Label (e.g. Large)"
                            class="flex-1 h-10 border-slate-200 bg-white/50"
                          />
                          <div class="relative w-full sm:w-32">
                            <span
                              class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold"
                            ></span>
                            <Input
                              v-model.number="value.extra_price"
                              type="number"
                              placeholder="+0"
                              class="h-10 pl-8 border-slate-200 bg-white/50"
                            />
                            <div
                              class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-hijau"
                            >
                              +
                            </div>
                          </div>
                          <Button
                            type="button"
                            @click="removeValue(optionIndex, valueIndex)"
                            :disabled="option.values.length === 1"
                            variant="ghost"
                            size="icon"
                            class="h-10 w-10 text-slate-400 hover:text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          @click="addValue(optionIndex)"
                          variant="ghost"
                          size="sm"
                          class="mt-2 text-hijau hover:bg-hijau/10 transition-colors h-8 gap-1.5"
                        >
                          <Plus class="h-3 w-3" />
                          Add Choice
                        </Button>
                      </div>
                    </div>

                    <div class="flex md:justify-end items-start pt-8">
                      <Button
                        type="button"
                        @click="removeOption(optionIndex)"
                        :disabled="options.length === 1"
                        variant="ghost"
                        size="icon"
                        class="h-10 w-10 text-slate-400 hover:text-white hover:bg-destructive transition-all rounded-xl"
                      >
                        <Trash2 class="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-4 pt-6 border-t border-muted/50 mt-4">
              <Button
                type="button"
                variant="ghost"
                @click="goBack"
                class="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                Cancel
              </Button>
              <Button
                class="w-full md:w-auto px-10 h-11 bg-hijau hover:bg-hijautua text-white font-semibold shadow-lg shadow-hijau/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                type="submit"
                :disabled="isSubmitting"
              >
                <PackagePlus v-if="!isSubmitting" class="h-4 w-4 mr-2" />
                <span
                  v-else
                  class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
                ></span>
                {{ isSubmitting ? 'Creating Product...' : 'Publish Product' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.form-input-focus {
  @apply focus-visible:ring-offset-0 transition-all duration-200;
}
</style>
