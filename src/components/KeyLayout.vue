<template>
  <div
    class="text-smallest xl:text-xs transition-colors duration-75 size-3 xl:size-7 flex justify-center items-center rounded-sm"
    :class="props.value ? 'bg-primary' : 'text-background bg-text'"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(["value"]);
</script>
