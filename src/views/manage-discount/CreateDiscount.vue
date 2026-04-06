<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { computed, ref } from 'vue'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  CalendarIcon,
  ArrowLeft,
  Ticket,
  Percent,
  Calendar as CalendarIcon2,
  Settings2,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
  Milestone,
} from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import { useDiscountStore } from '@/store/useDiscountStore'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'vue-router'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'

const router = useRouter()
const discountStore = useDiscountStore()
const isSubmitting = ref(false)

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const formSchema = toTypedSchema(
  z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').max(100),
    description: z.string().max(200).optional(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'] as const),
    value: z.coerce.number().min(0).max(1000000),
    min_purchase: z.coerce.number().min(0).optional(),
    max_discount: z.coerce.number().min(0).optional(),
    valid_days: z.array(z.string()).default([]),
    start_date: z.date({ required_error: 'Start date is required' }),
    end_date: z.date({ required_error: 'End date is required' }),
    is_active: z.boolean().default(true),
  }),
)

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    type: 'PERCENTAGE',
    is_active: true,
    valid_days: [],
    value: 0,
    min_purchase: 0,
    max_discount: 0,
  },
})

const startDateValue = computed({
  get: () =>
    values.start_date ? parseDate(values.start_date.toISOString().slice(0, 10)) : undefined,
  set: (val) => val,
})

const endDateValue = computed({
  get: () => (values.end_date ? parseDate(values.end_date.toISOString().slice(0, 10)) : undefined),
  set: (val) => val,
})

const onSubmit = handleSubmit(async (formValues) => {
  isSubmitting.value = true
  try {
    await discountStore.createDiscount({
      ...formValues,
      start_date: formValues.start_date.toISOString(),
      end_date: formValues.end_date.toISOString(),
    })
    router.push('/discount')
  } catch (error) {
    console.error('Error creating discount:', error)
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
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Create Promotion</h1>
          <p class="text-sm text-slate-500">Set up a new discount code or seasonal promotion.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar Tips -->
      <div class="lg:col-span-1 space-y-6 flex flex-col order-2 lg:order-1">
        <Card
          class="overflow-hidden border-none shadow-xl bg-gradient-to-br from-hijau/10 via-white to-white h-full"
        >
          <CardHeader>
            <div
              class="h-16 w-16 rounded-2xl bg-hijau/20 flex items-center justify-center mb-4 border border-hijau/20 shadow-sm transition-transform hover:scale-105 duration-300"
            >
              <Ticket class="h-8 w-8 text-hijau" />
            </div>
            <CardTitle class="text-xl font-bold">Promotion Tips</CardTitle>
            <CardDescription>Boost your sales with effective discounts.</CardDescription>
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
                  <h4 class="text-sm font-semibold">Catchy Codes</h4>
                  <p class="text-xs text-slate-500">Use codes like COFFEE20 or MORNINGVIBES.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="mt-1 h-5 w-5 rounded-full bg-hijau/10 flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle2 class="h-3 w-3 text-hijau" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold">Minimum Purchase</h4>
                  <p class="text-xs text-slate-500">
                    Encourage higher spending with a minimum threshold.
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
                  <h4 class="text-sm font-semibold">Scheduling</h4>
                  <p class="text-xs text-slate-500">
                    Set specific start and end dates for limited offers.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start mt-6"
            >
              <Info class="h-5 w-5 text-hijau mt-0.5" />
              <p class="text-xs text-slate-500 leading-relaxed">
                Active discounts will be automatically applied at checkout if criteria are met.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Form -->
      <Card
        class="lg:col-span-2 shadow-xl border-slate-200 bg-white/50 backdrop-blur-sm order-1 lg:order-2"
      >
        <CardHeader>
          <CardTitle class="text-xl font-bold flex items-center gap-2">
            Discount configuration
          </CardTitle>
          <CardDescription>Define the rules for this promotional offer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Code -->
              <FormField v-slot="{ componentField }" name="code">
                <FormItem class="md:col-span-2">
                  <FormLabel class="flex items-center gap-2">
                    <Milestone class="h-4 w-4 text-hijau" />
                    Promo Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="e.g. COFFEETIME25"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all font-mono font-bold uppercase tracking-wider"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Description -->
              <FormField v-slot="{ componentField }" name="description">
                <FormItem class="md:col-span-2">
                  <FormLabel class="flex items-center gap-2">
                    <Info class="h-4 w-4 text-hijau" />
                    Highlight / Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="e.g. 25% off for all Arabica menu"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Type -->
              <FormField v-slot="{ value, handleChange }" name="type">
                <FormItem>
                  <FormLabel class="flex items-center gap-2">
                    <Settings2 class="h-4 w-4 text-hijau" />
                    Discount Type
                  </FormLabel>
                  <FormControl>
                    <Select :model-value="value" @update:model-value="handleChange">
                      <SelectTrigger class="w-full bg-white/80 focus:ring-hijautua h-11 shadow-sm">
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                          <SelectItem value="FIXED_AMOUNT">Fixed Amount (Rp)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Value -->
              <FormField v-slot="{ componentField }" name="value">
                <FormItem>
                  <FormLabel class="flex items-center gap-2">
                    <Percent class="h-4 w-4 text-hijau" />
                    Value
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

              <!-- Min Purchase -->
              <FormField v-slot="{ componentField }" name="min_purchase">
                <FormItem>
                  <FormLabel class="flex items-center gap-2">
                    <Clock class="h-4 w-4 text-hijau" />
                    Min. Purchase
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="number"
                      placeholder="Rp 0"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Max Discount -->
              <FormField v-slot="{ componentField }" name="max_discount">
                <FormItem>
                  <FormLabel class="flex items-center gap-2 text-slate-500">
                    Max Discount (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="number"
                      placeholder="Rp 0"
                      class="bg-white/80 focus-visible:ring-hijautua h-11 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Valid Days -->
              <FormField v-slot="{ componentField }" name="valid_days">
                <FormItem class="md:col-span-2">
                  <FormLabel>Active Days</FormLabel>
                  <FormControl>
                    <TagsInput
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField['onUpdate:modelValue']"
                      class="bg-white/80 border-slate-200 focus-within:ring-2 focus-within:ring-hijau/20 transition-all rounded-xl min-h-[50px] p-2"
                    >
                      <div class="flex flex-wrap gap-2">
                        <TagsInputItem
                          v-for="item in componentField.modelValue"
                          :key="item"
                          :value="item"
                          class="bg-hijau/10 text-hijau border-hijau/20 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          <TagsInputItemText />
                          <TagsInputItemDelete />
                        </TagsInputItem>
                      </div>
                      <TagsInputInput
                        placeholder="Type day (e.g. Monday) and press Enter..."
                        class="text-sm placeholder:text-slate-400 p-2"
                      />
                    </TagsInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Duration Section -->
              <div class="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                <h4 class="text-sm font-bold flex items-center gap-2">
                  <CalendarIcon2 class="h-4 w-4 text-hijau" />
                  Promo Validity Period
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <!-- Start Date -->
                  <FormField name="start_date">
                    <FormItem class="flex flex-col">
                      <FormLabel class="mb-1 text-xs font-medium text-slate-500"
                        >Start Date</FormLabel
                      >
                      <Popover>
                        <PopoverTrigger as-child>
                          <FormControl>
                            <Button
                              variant="outline"
                              :class="
                                cn(
                                  'w-full h-11 justify-start text-left font-normal bg-white/80 rounded-xl border-slate-200',
                                  !startDateValue && 'text-slate-400',
                                )
                              "
                            >
                              <CalendarIcon class="mr-2 h-4 w-4 text-hijau opacity-70" />
                              {{
                                startDateValue
                                  ? df.format(startDateValue.toDate(getLocalTimeZone()))
                                  : 'Select Start Date'
                              }}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0 rounded-2xl shadow-2xl border-none">
                          <Calendar
                            :model-value="startDateValue"
                            initial-focus
                            :min-value="new CalendarDate(2020, 1, 1)"
                            @update:model-value="
                              (v) =>
                                setFieldValue(
                                  'start_date',
                                  v ? v.toDate(getLocalTimeZone()) : undefined,
                                )
                            "
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <!-- End Date -->
                  <FormField name="end_date">
                    <FormItem class="flex flex-col">
                      <FormLabel class="mb-1 text-xs font-medium text-slate-500"
                        >End Date</FormLabel
                      >
                      <Popover>
                        <PopoverTrigger as-child>
                          <FormControl>
                            <Button
                              variant="outline"
                              :class="
                                cn(
                                  'w-full h-11 justify-start text-left font-normal bg-white/80 rounded-xl border-slate-200',
                                  !endDateValue && 'text-slate-400',
                                )
                              "
                            >
                              <CalendarIcon class="mr-2 h-4 w-4 text-hijau opacity-70" />
                              {{
                                endDateValue
                                  ? df.format(endDateValue.toDate(getLocalTimeZone()))
                                  : 'Select End Date'
                              }}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0 rounded-2xl shadow-2xl border-none">
                          <Calendar
                            :model-value="endDateValue"
                            initial-focus
                            :min-value="startDateValue || new CalendarDate(2020, 1, 1)"
                            @update:model-value="
                              (v) =>
                                setFieldValue(
                                  'end_date',
                                  v ? v.toDate(getLocalTimeZone()) : undefined,
                                )
                            "
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </div>

              <!-- Switch -->
              <FormField v-slot="{ value, handleChange }" name="is_active">
                <FormItem
                  class="md:col-span-2 flex flex-row items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100"
                >
                  <div class="space-y-0.5">
                    <FormLabel class="text-base font-bold">Enable Promo</FormLabel>
                    <p class="text-xs text-slate-500">
                      Only active promos can be applied to orders.
                    </p>
                  </div>
                  <FormControl>
                    <Switch :checked="value" @update:checked="handleChange" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                @click="goBack"
                class="hover:bg-destructive/10 hover:text-destructive transition-colors px-6"
              >
                Cancel
              </Button>
              <Button
                class="w-full md:w-auto px-10 h-11 bg-hijau hover:bg-hijautua text-white font-bold shadow-lg shadow-hijau/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                type="submit"
                :disabled="isSubmitting"
              >
                <Ticket v-if="!isSubmitting" class="h-4 w-4 mr-2" />
                <span
                  v-else
                  class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
                ></span>
                {{ isSubmitting ? 'Creating Promo...' : 'Launch Promotion' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
