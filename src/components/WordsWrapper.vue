<template>
  <div
    class="words-wrapper text-2xl xl:text-3xl text-primary flex gap-4 xl:gap-6 transition-all ease-linear duration-75"
    :class="[props.isInputFocused ? 'blur-none' : 'blur-sm']"
    :style="props.wordsWrapperStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(["isInputFocused", "wordsWrapperStyle"]);
</script>
