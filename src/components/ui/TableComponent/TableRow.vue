<script setup lang="ts"></script>
<template>
  <tr :class="'border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100'">
    <slot></slot>
  </tr>
</template>
