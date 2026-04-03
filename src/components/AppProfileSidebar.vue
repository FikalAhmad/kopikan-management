<template>
  <div
    class="fixed top-0 right-0 h-screen bg-white shadow-2xl transition-all duration-500 ease-in-out border-l border-gray-100 z-[9999] overflow-hidden"
    :class="[visible ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full']"
  >
    <div class="flex flex-col h-full items-center justify-between p-6 w-80">
      <div class="w-full">
        <button
          @click="emit('close-sidebar')"
          class="cursor-pointer p-2 rounded-full w-max hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="23"
            height="23"
            color="#202024"
            fill="none"
          >
            <path
              d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div class="flex flex-col items-center gap-4 w-full whitespace-nowrap">
        <div class="rounded-full ring-4 ring-gray-50 shadow-xl overflow-hidden">
          <img src="/images/barista.jpg" alt="Avatar" class="w-32 h-32 object-cover" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="font-bold text-2xl text-gray-800">{{ authStore.user?.name  }}</div>
          <div class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{authStore.user?.role_name}}</div>
        </div>
      </div>
      <div class="w-full pb-8">
        <Button variant="destructive" class="w-full py-4 text-lg font-bold" @click="handleLogout">Logout</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import Button from './ui/button/Button.vue'

const emit = defineEmits(['close-sidebar'])
defineProps<{ visible: boolean }>()

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
