<template>
  <div
    class="max-w-0 fixed top-0 right-0 h-screen w-64 bg-white shadow-lg transition-[max-width] duration-500 ease-in-out rounded-l-lg overflow-x-hidden z-10"
    :class="visible && 'max-w-lg'"
  >
    <div class="flex flex-col h-full items-center justify-between">
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
      <div class="flex flex-col gap-2">
        <div class="rounded-full shadow-lg w-20">
          <img src="/images/barista.jpg" alt="Avatar" class="w-20 h-20 rounded-full" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="font-semibold text-lg">{{ authStore.user?.name }}</div>
          <div class="text-sm">Admin</div>
        </div>
      </div>
      <div>
        <AppButton variant="danger" @click="handleLogout">Logout</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import AppButton from './ui/ButtonComponent/AppButton.vue'

const emit = defineEmits(['close-sidebar'])
defineProps<{ visible: boolean }>()

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
