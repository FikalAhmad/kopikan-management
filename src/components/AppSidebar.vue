<template>
  <aside
    class="max-w-0 w-72 min-h-screen border-r-2 border-gray-100 flex flex-col items-center pt-2 gap-4 bg-white shadow-lg transition-[max-width] duration-500 ease-in-out overflow-x-hidden"
    :class="visible && 'max-w-96'"
  >
    <div class="w-48">
      <img src="/images/logotype-hijau.webp" alt="Logo" class="w-48" />
    </div>
    <div class="flex flex-col justify-center p-4 gap-3 w-full">
      <div class="text-[4px] px-4 font-bold text-gray-500 mt-2">OVERVIEW</div>
      <AppNavLink to="/dashboard" class="flex gap-3">
        <img
          src="../components/icons/dashboard-icon.svg"
          alt="dashboard-icon"
          class="group-hover:invert"
        />
        Home</AppNavLink
      >
      <AppNavLink to="/analytics" class="flex gap-3">
        <img
          src="../components/icons/analytic-icon.svg"
          alt="analytics-icon"
          class="group-hover:invert"
        />Analytics</AppNavLink
      >
      <div class="text-[4px] font-bold text-gray-500 mt-2 px-4">MANAGEMENT</div>
      <AppNavLink to="/user" class="flex gap-3"
        ><img
          src="../components/icons/user-icon.svg"
          alt="user-icon"
          class="group-hover:invert"
        />User</AppNavLink
      >
      <AppNavLink to="/product" class="flex gap-3"
        ><img
          src="../components/icons/product-icon.svg"
          alt="product-icon"
          class="group-hover:invert"
        />Product</AppNavLink
      >
      <AppNavLink to="/order" class="flex gap-3"
        ><img
          src="../components/icons/order-icon.svg"
          alt="order-icon"
          class="group-hover:invert"
        />Order</AppNavLink
      >
      <AppNavLink to="/payment" class="flex gap-3"
        ><img
          src="../components/icons/payment-icon.svg"
          alt="payment-icon"
          class="group-hover:invert"
        />Payment</AppNavLink
      >

      <!-- <button
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
      </div> -->
    </div>
  </aside>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import AppNavLink from './ui/AppNavLink.vue'

defineProps<{ visible: boolean }>()

// const openDropdown = ref<boolean>(false)

// const toggleDropdown = () => {
//   openDropdown.value = !openDropdown.value
// }
</script>
<style></style>
