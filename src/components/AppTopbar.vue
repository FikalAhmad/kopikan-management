<template>
  <div class="h-16 border-b-2 border-gray-100 flex justify-between items-center p-4 relative">
    <Button @click="emit('toggle-sidebar')" variant="ghost" size="icon" class="p-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        color="#202024"
        fill="none"
      >
        <path
          d="M4 5L20 5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4 12L20 12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4 19L20 19"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Button>

    <Button
      @click="isProfileSidebar"
      variant="ghost"
      class="cursor-pointer rounded-full"
      size="icon"
    >
      <img src="/images/barista.jpg" alt="Avatar" class="rounded-full shadow-lg" />
    </Button>
    <AppProfileSidebar :visible="toggleProfileSidebar" @close-sidebar="isProfileSidebar" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AppProfileSidebar from './AppProfileSidebar.vue'
import { Button } from './ui/ButtonComponent'

const emit = defineEmits(['toggle-sidebar'])
const toggleProfileSidebar = ref<boolean>(false)

const isProfileSidebar = () => {
  toggleProfileSidebar.value = !toggleProfileSidebar.value
}
</script>
