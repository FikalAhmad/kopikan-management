<template>
  <router-link
    :to="props.to"
    :aria-checked="isActive.toString()"
    :class="[
      'flex px-4 py-2 rounded-lg font-medium transition-all hover:text-white hover:bg-hijautua/85 group',
      isActive ? 'bg-hijautua text-white [&>img]:invert' : '',
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
