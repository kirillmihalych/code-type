<template>
  <div class="px-10 opacity-75 flex gap-4 text-primary text-3xl">
    <div>
      <span> {{ props.writtenWordsAmount }}</span
      >/{{ props.totalWordsAmount }}
    </div>
    <div>{{ props.wpm }}</div>
    <div>{{ accuracy }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps([
  "totalWordsAmount",
  "writtenCharsAmount",
  "writtenWordsAmount",
  "totalChars",
  "wpm",
  "mistakes",
]);

const mistakesPercent = computed(() => {
  return Math.round(100 - (props.mistakes / props.writtenCharsAmount) * 100);
});
const accuracy = computed(() => {
  return isNaN(mistakesPercent.value) || !isFinite(mistakesPercent.value)
    ? "100%"
    : mistakesPercent.value < 0
    ? "0%"
    : `${mistakesPercent.value}%`;
});
</script>

<style>
/*
*/
</style>
