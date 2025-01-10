<template>
  <div class="px-10 opacity-75 flex gap-4 text-primary text-3xl">
    <div>
      <span> {{ props.writtenWordsAmount }}</span
      >/{{ props.totalWordsAmount }}
    </div>
    <div>{{ props.wpm }}</div>
    <div>{{ props.accuracy }}</div>
    <div class="flex gap-2">
      [
      <span>WPM {{ props.finalResultWpm }}</span>
      
      <span>ACC {{ props.finalAccuracy }}</span>
      ]
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "totalWordsAmount",
  "writtenCharsAmount",
  "writtenWordsAmount",
  "totalChars",
  "wpm",
  "accuracy",
  "finalAccuracy",
  "mistakes",
  "finalResultWpm",
]);

// const mistakesPercent = computed(() => {
//   return Math.round(100 - (props.mistakes / props.writtenCharsAmount) * 100);
// });
// const accuracy = computed(() => {
//   return isNaN(mistakesPercent.value) || !isFinite(mistakesPercent.value)
//     ? "100%"
//     : mistakesPercent.value < 0
//     ? "0%"
//     : `${mistakesPercent.value}%`;
// });
</script>

<style>
/*
*/
</style>
