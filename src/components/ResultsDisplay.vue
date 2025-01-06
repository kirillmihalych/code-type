<template>
  <div class="px-10 opacity-75 flex gap-2 text-purple-500">
    <div>
      <span> {{ props.writtenWordsAmount }}</span
      >/{{ props.totalWordsAmount }}
    </div>
    <div>
      {{ props.wpm }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["totalWordsAmount", "writtenWordsAmount", "wpm"]);
</script>

<style>
/* 
*/
</style>
