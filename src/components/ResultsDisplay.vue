<template>
  <div class="grid place-items-center">
    <!-- last test results -->
    <div v-if="!props.isTestStarted" class="flex gap-2 text-text">
      <span><i class="fa-solid fa-chart-column"></i></span>
      <span>wpm {{ props.finalResultWpm }}</span>
      <span>acc {{ props.finalAccuracy }}</span>
    </div>
    <!-- current results -->
    <div v-if="props.isTestStarted" class="flex gap-4 text-primary text-3xl">
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
  "isTestStarted",
]);
</script>
