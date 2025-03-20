<script lang="ts" setup>
defineProps<{
  openModal: boolean
}>()
</script>

<template>
  <div v-if="openModal" :class="'fixed inset-0 flex items-center justify-center bg-black/25'">
    <slot />
  </div>
</template>
