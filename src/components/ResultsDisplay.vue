<template>
  <div class="grid place-items-center opacity-75">
    <div class="flex gap-2 text-helper">
      <span>Results</span>
      <span>WPM {{ props.finalResultWpm }}</span>
      <span>ACC {{ props.finalAccuracy }}</span>
    </div>
    <div class="flex gap-4 text-primary text-3xl">
      <div>
        <span> {{ props.writtenWordsAmount }}</span
        >/{{ props.totalWordsAmount }}
      </div>
      <div>{{ props.wpm }}</div>
      <div>{{ props.accuracy }}</div>
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
