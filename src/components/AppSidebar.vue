<template>
  <aside
    class="relative h-screen bg-white border-r-2 border-gray-100 shadow-lg transition-all duration-500 ease-in-out flex flex-col items-center pt-2 gap-4 overflow-x-hidden"
    :class="[visible ? 'w-72 opacity-100' : 'w-0 opacity-0 border-none px-0']"
  >
    <div class="w-48 shrink-0 py-4 flex items-center gap-2">
      <img src="/images/logo-cup-hijau.webp" alt="Logo" class="w-12" />
       <div class="text-2xl font-bold text-gray-800">Kopikan Coffee</div>
    </div>
    <div class="flex flex-col justify-center px-4 gap-3 w-72 whitespace-nowrap overflow-x-hidden">
      <div class="text-xs px-4 font-bold text-gray-500 mt-2 uppercase tracking-wider">OVERVIEW</div>
      <AppNavLink to="/dashboard" class="flex gap-3 items-center" v-slot="{ isActive }">
        <HomeIcon :class="['group-hover:text-white', isActive ? 'text-white' : 'text-gray-500']" />
        Home</AppNavLink
      >
      <div class="text-xs px-4 font-bold text-gray-500 mt-2 uppercase tracking-wider">MANAGEMENT</div>

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
import {
  AnalyticIcon,
  DiscountIcon,
  HomeIcon,
  OrderIcon,
  PaymentIcon,
  ProductIcon,
  UserIcon,
} from '@/lib/icons'
import AppNavLink from './ui/AppNavLink.vue'

defineProps<{ visible: boolean }>()
</script>
<style></style>
