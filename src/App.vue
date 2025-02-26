<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

const isSidebarVisible = ref(true)

const toggleProfile = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <div class="flex">
    <div class="">
      <AppSidebar :visible="isSidebarVisible" />
    </div>
    <div class="w-full">
      <AppTopbar @toggle-sidebar="toggleProfile" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
