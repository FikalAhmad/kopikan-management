<script setup lang="ts">
const props = defineProps<{
  for?: string
}>()
</script>

<template>
  <label :for="props.for" class="font-semibold text-gray-700">
    <slot></slot>
  </label>
</template>
