<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'

const isSidebarVisible = ref(true)

const toggleProfile = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <div class="flex">
    <div class="relative">
      <AppSidebar :visible="isSidebarVisible" />
    </div>
    <div
      class="w-full transition-all duration-300 overflow-x-hidden"
      :class="isSidebarVisible ? 'ml-72' : 'ml-0'"
    >
      <AppTopbar @toggle-sidebar="toggleProfile" />
      <RouterView />
    </div>
  </div>
</template>
