<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'

const isLargeScreen = useMediaQuery('(min-width: 1080px)')
const isSidebarVisible = ref(isLargeScreen.value)

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

// Update sidebar visibility when crossing the 1080px breakpoint
watch(isLargeScreen, (newVal) => {
  isSidebarVisible.value = newVal
})

onMounted(() => {
  // Sync the initial state on mount
  isSidebarVisible.value = isLargeScreen.value
})
</script>

<template>
  <div class="flex h-screen overflow-hidden relative">
    <!-- Overlay for screens < 1080px when sidebar is open -->
    <Transition
      enter-active-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!isLargeScreen && isSidebarVisible"
        class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300"
        @click="toggleSidebar"
      ></div>
    </Transition>

    <div
      :class="[
        !isLargeScreen ? 'fixed top-0 left-0 bottom-0 z-50' : 'relative shrink-0',
        'transition-all duration-500'
      ]"
    >
      <AppSidebar :visible="isSidebarVisible" />
    </div>

    <div class="flex-1 min-w-0 h-screen flex flex-col">
      <AppTopbar @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 flex flex-col min-h-0 w-full p-4 overflow-hidden bg-slate-50/50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
