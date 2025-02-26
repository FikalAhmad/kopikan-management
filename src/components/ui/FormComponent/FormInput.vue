<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <slot></slot>
    <input
      :type="type || 'text'"
      :placeholder="placeholder || ''"
      :value="modelValue"
      @input="handleInput"
      class="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
</template>
