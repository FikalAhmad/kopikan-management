<template>
  <aside
    class="fixed left-0 top-0 z-10 w-72 min-h-screen border-r-2 border-gray-100 flex flex-col items-center pt-2 gap-4 bg-white shadow-lg transition-transform duration-300 overflow-x-hidden"
    :class="visible ? 'translate-x-0' : '-translate-x-72'"
  >
    <div class="w-full flex justify-center mt-2">
      <img src="/images/logotype-hijau.webp" alt="Logo" class="w-32" />
    </div>
    <div class="flex flex-col justify-center p-4 gap-3 w-full">
      <div class="text-[4px] px-4 font-bold text-gray-500 mt-2">OVERVIEW</div>
      <AppNavLink to="/dashboard" class="flex gap-3 items-center" v-slot="{ isActive }">
        <HomeIcon :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']" />
        Home</AppNavLink
      >
      <div class="text-[4px] font-bold text-gray-500 mt-2 px-4">MANAGEMENT</div>

      <AppNavLink to="/user" class="flex gap-3 items-center" v-slot="{ isActive }"
        ><UserIcon
          :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']"
        />User</AppNavLink
      >

      <AppNavLink to="/product" class="flex gap-3 items-center" v-slot="{ isActive }"
        ><ProductIcon
          :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']"
        />Product</AppNavLink
      >

      <AppNavLink to="/discount" class="flex gap-3 items-center" v-slot="{ isActive }"
        ><DiscountIcon
          :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']"
        />Discount</AppNavLink
      >

      <AppNavLink to="/order" class="flex gap-3 items-center" v-slot="{ isActive }"
        ><OrderIcon
          :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']"
        />Order</AppNavLink
      >

      <AppNavLink to="/payment" class="flex gap-3 items-center" v-slot="{ isActive }"
        ><PaymentIcon
          :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']"
        />Payment</AppNavLink
      >
    </div>
  </aside>
</template>

<script setup lang="ts">
import { DiscountIcon, HomeIcon, OrderIcon, PaymentIcon, ProductIcon, UserIcon } from '@/lib/icons'
import AppNavLink from './ui/AppNavLink.vue'

defineProps<{ visible: boolean }>()
</script>
<style></style>
