<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { computed } from 'vue'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import { useDiscountStore } from '@/store/useDiscountStore'
import { Switch } from '@/components/ui/switch'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'

const discountStore = useDiscountStore()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const formSchema = toTypedSchema(
  z.object({
    code: z.string().min(3).max(100),
    description: z.string().max(200),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'] as const),
    value: z.number().lte(1000000),
    min_purchase: z.number().lte(100000).optional(),
    valid_days: z.array(z.string().min(1).max(100)).optional(),
    time_start: z
      .string()
      .refine((v) => v, { message: 'A date of birth is required.' })
      .optional(),
    time_end: z
      .string()
      .refine((v) => v, { message: 'A date of birth is required.' })
      .optional(),
    start_date: z.date(),
    end_date: z.date(),
    is_active: z.boolean().default(true),
  }),
)
const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
})
const timeStartValue = computed({
  get: () => (values.time_start ? parseDate(values.time_start) : undefined),
  set: (val) => val,
})
const timeEndValue = computed({
  get: () => (values.time_end ? parseDate(values.time_end) : undefined),
  set: (val) => val,
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

const onSubmit = handleSubmit((values) => {
  discountStore.createDiscount({
    ...values,
    start_date:
      values.start_date instanceof Date ? values.start_date.toISOString() : values.start_date,
    end_date: values.end_date instanceof Date ? values.end_date.toISOString() : values.end_date,
  })
})
</script>
<template>
  <Card class="m-5">
    <CardHeader>
      <CardTitle>Create Discount</CardTitle>
      <CardDescription>Add discount here</CardDescription>
    </CardHeader>
    <ScrollArea class="h-[450px]">
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Discount Code -->
          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter discount code here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Description -->
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter description here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Type -->
          <FormField v-slot="{ value, handleChange }" name="type">
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select :model-value="value" @update:model-value="handleChange">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Choose type of discount here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
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
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" placeholder="Enter discount value" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Min Purchase -->
          <FormField v-slot="{ componentField }" name="min_purchase">
            <FormItem>
              <FormLabel>Minimum Purchase</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="Enter the minimum purchase"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Max Discount -->
          <FormField v-slot="{ componentField }" name="max_discount">
            <FormItem>
              <FormLabel>Maximum Discount</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="Enter the maximum discount"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Valid Days -->
          <FormField v-slot="{ componentField }" name="valid_days">
            <FormItem>
              <FormLabel>Valid Days</FormLabel>
              <FormControl>
                <TagsInput
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                >
                  <TagsInputItem
                    v-for="item in componentField.modelValue"
                    :key="item"
                    :value="item"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>

                  <TagsInputInput placeholder="Select valid days here..." />
                </TagsInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Dates -->
          <div class="flex gap-10">
            <!-- Time Start -->
            <FormField name="time_start">
              <FormItem>
                <FormLabel>Time Start</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="
                          cn(
                            'w-[240px] ps-3 text-start font-normal',
                            !timeStartValue && 'text-muted-foreground',
                          )
                        "
                      >
                        <span>{{
                          timeStartValue
                            ? df.format(timeStartValue.toDate(getLocalTimeZone()))
                            : 'Pick a date'
                        }}</span>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                      <input hidden />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      :model-value="timeStartValue"
                      calendar-label="Time Start"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      @update:model-value="(v) => setFieldValue('time_start', v?.toString())"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </FormField>

            <!-- Time End -->
            <FormField name="time_end">
              <FormItem>
                <FormLabel>Time End</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="
                          cn(
                            'w-[240px] ps-3 text-start font-normal',
                            !timeEndValue && 'text-muted-foreground',
                          )
                        "
                      >
                        <span>{{
                          timeEndValue
                            ? df.format(timeEndValue.toDate(getLocalTimeZone()))
                            : 'Pick a date'
                        }}</span>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                      <input hidden />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      :model-value="timeEndValue"
                      calendar-label="Time End"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      @update:model-value="(v) => setFieldValue('time_end', v?.toString())"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </FormField>
          </div>

          <div class="flex gap-10">
            <!-- Start Date -->
            <FormField name="start_date">
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="
                          cn(
                            'w-[240px] ps-3 text-start font-normal',
                            !startDateValue && 'text-muted-foreground',
                          )
                        "
                      >
                        <span>{{
                          startDateValue
                            ? df.format(startDateValue.toDate(getLocalTimeZone()))
                            : 'Pick a date'
                        }}</span>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                      <input hidden />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      :model-value="startDateValue"
                      calendar-label="Start Date"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      @update:model-value="
                        (v) =>
                          setFieldValue('start_date', v ? v.toDate(getLocalTimeZone()) : undefined)
                      "
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </FormField>

            <!-- End Date -->
            <FormField name="end_date">
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="
                          cn(
                            'w-[240px] ps-3 text-start font-normal',
                            !endDateValue && 'text-muted-foreground',
                          )
                        "
                      >
                        <span>{{
                          endDateValue
                            ? df.format(endDateValue.toDate(getLocalTimeZone()))
                            : 'Pick a date'
                        }}</span>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                      <input hidden />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      :model-value="endDateValue"
                      calendar-label="End Date"
                      initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)"
                      @update:model-value="
                        (v) =>
                          setFieldValue('end_date', v ? v.toDate(getLocalTimeZone()) : undefined)
                      "
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </FormField>
          </div>

          <!-- Active Switch -->
          <FormField v-slot="{ value, handleChange }" name="is_active">
            <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel class="text-base">Discount Status</FormLabel>
              <FormControl>
                <Switch :model-value="value" @update:model-value="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

          <!-- Submit -->
          <Button class="w-full" type="submit">Create Discount</Button>
        </form>
      </CardContent>
    </ScrollArea>
  </Card>
</template>
