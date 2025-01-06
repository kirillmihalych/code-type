<template>
  <div
    class="text-xs transition-colors duration-75 w-7 h-7 flex justify-center items-center rounded-sm text-text"
    :class="props.value ? 'bg-primary' : 'bg-bg'"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(["value"]);
</script>
