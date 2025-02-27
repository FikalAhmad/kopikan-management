<script setup lang="ts"></script>
<template>
  <tfoot :class="'border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0'">
    <slot></slot>
  </tfoot>
</template>
