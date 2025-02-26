<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Mapping variant ke Tailwind CSS
const buttonClasses = computed(() => {
  const base = 'rounded-lg font-medium focus:outline-none focus:ring-2 transition-all'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    outline: 'border border-gray-400 text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:bg-gray-200 focus:ring-gray-300',
  }
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  }

  return `${base} ${variants[props.variant || 'primary']} ${sizes[props.size || 'md']} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
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
