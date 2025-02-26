<template>
  <router-link
    :to="props.to"
    :class="[
      'flex px-4 py-2 rounded-lg font-medium transition-all hover:text-white hover:bg-hijautua/75',
      isActive ? 'bg-hijautua text-white' : '',
    ]"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  to: string
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>
