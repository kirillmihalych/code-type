<template>
  <div
    class="transition-colors duration-100 w-10 h-10 font-bold flex justify-center items-center rounded-sm text-gray-600"
    :class="props.value ? 'bg-purple-400' : 'bg-purple-200'"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(["value"]);
</script>
