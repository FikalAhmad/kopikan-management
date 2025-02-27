<script setup lang="ts"></script>
<template>
  <th
    :class="'p-2 text-left align-middle font-bold text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'"
  >
    <slot></slot>
  </th>
</template>
