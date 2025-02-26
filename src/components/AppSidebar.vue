<template>
  <aside
    class="max-w-0 w-72 min-h-screen border-r-2 border-gray-100 flex flex-col items-center pt-2 gap-4 bg-white shadow-lg transition-[max-width] duration-500 ease-in-out overflow-x-hidden"
    :class="visible && 'max-w-96'"
  >
    <div class="w-48">
      <img src="/images/logotype-hijau.webp" alt="Logo" class="w-48" />
    </div>
    <div class="flex flex-col justify-center p-4 gap-3 w-full">
      <AppNavLink to="/">Home</AppNavLink>
      <AppNavLink to="/analytics">Analytics</AppNavLink>
      <AppNavLink to="/user">User</AppNavLink>
      <button
        :class="['px-4 py-2 rounded-lg font-medium  hover:text-white hover:bg-hijautua/75']"
        @click="toggleDropdown"
      >
        User
      </button>
      <div
        class="border-l-2 flex flex-col gap-1 ml-5 pl-5 transition-[max-height] duration-500 ease-in-out overflow-hidden max-h-0"
        :class="openDropdown && 'max-h-96'"
      >
        <div class="">
          <AppNavLink to="/">Create User</AppNavLink>
        </div>
        <div class="">
          <AppNavLink to="/">Edit User</AppNavLink>
        </div>
      </div>

      <AppNavLink to="/product">Product</AppNavLink>
      <AppNavLink to="/order">Order</AppNavLink>
      <AppNavLink to="/payment">Payment</AppNavLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavLink from './ui/AppNavLink.vue'

defineProps<{ visible: boolean }>()

const openDropdown = ref<boolean>(false)

const toggleDropdown = () => {
  openDropdown.value = !openDropdown.value
}
</script>
<style></style>
