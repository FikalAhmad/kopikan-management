<script setup lang="ts"></script>
<template>
  <div :class="'relative w-full overflow-auto'">
    <table :class="'w-full caption-bottom text-sm'">
      <slot></slot>
    </table>
  </div>
</template>
