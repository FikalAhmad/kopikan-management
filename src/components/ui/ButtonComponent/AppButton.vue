<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Mapping variant ke Tailwind CSS
const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const variants = {
    default: 'bg-hijautua text-white hover:bg-hijautua/85 focus:ring-hijautua',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    outline: 'border border-gray-400 text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:bg-gray-200 focus:ring-gray-300',
    link: 'text-white underline-offset-4 hover:underline',
  }
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  }

  return `${base} ${variants[props.variant || 'default']} ${sizes[props.size || 'default']} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
})
</script>

<template>
  <button
    :type="type || 'button'"
    :class="buttonClasses"
    :disabled="disabled"
    @click="(e) => emit('click', e)"
  >
    <slot></slot>
  </button>
</template>
