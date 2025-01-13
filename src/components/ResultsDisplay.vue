<template>
  <div class="grid place-items-center opacity-75">
    <div class="flex gap-2 text-helper uppercase">
      <span>Результаты</span>
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
  "accuracy",
  "wpm",
  "totalWordsAmount",
  "writtenWordsAmount",
  "finalAccuracy",
  "finalResultWpm",
]);
</script>
