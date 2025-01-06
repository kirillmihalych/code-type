<template>
  <div class="px-10 opacity-75 flex text-purple-500">
    <div>
      <span> {{ props.writtenWordsAmount }}</span
      >/{{ props.totalWordsAmount }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["totalWordsAmount", "writtenWordsAmount"]);
</script>

<style>
/* 
*/
</style>
