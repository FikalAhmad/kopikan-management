<script setup lang="ts">
import { ref } from 'vue'
import AppProfileSidebar from './AppProfileSidebar.vue'
import { Button } from './ui/button'
import BurgerIcon from '@/assets/icons/burger-icon.svg?component'

const emit = defineEmits(['toggle-sidebar'])
const toggleProfileSidebar = ref<boolean>(false)

const isProfileSidebar = () => {
  toggleProfileSidebar.value = !toggleProfileSidebar.value
}
</script>

<template>
  <div
    class="h-16 border-b-2 border-gray-100 bg-white flex justify-between items-center p-4 sticky z-10 top-0 shadow transition-all"
  >
    <Button @click="emit('toggle-sidebar')" variant="ghost" size="icon" class="p-1">
      <BurgerIcon />
    </Button>

    <Button
      @click="isProfileSidebar"
      variant="ghost"
      class="cursor-pointer rounded-full hover:scale-105 w-12 h-12 transition-all duration-200s border-4 border-black/50"
      size="icon"
    >
      <img src="/images/barista.jpg" alt="Avatar" class="rounded-full shadow-lg" />
    </Button>
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toggleProfileSidebar"
        class="fixed inset-0 bg-gray-500/50 backdrop-blur-sm z-40 pointer-events-auto"
        @click="isProfileSidebar"
      ></div>
    </transition>

    <AppProfileSidebar :visible="toggleProfileSidebar" @close-sidebar="isProfileSidebar" />
  </div>
</template>
