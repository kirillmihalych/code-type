<template>
  <div
    class="text-smallest transition-colors duration-75 size-3 xl:size-5 flex justify-center items-center rounded-sm"
    :class="props.value ? 'bg-primary' : 'text-background bg-text'"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(["value"]);
</script>
