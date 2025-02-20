<template>
  <div></div>
</template>

<script setup>
import { watchEffect } from "vue";
import { useInterval } from "@vueuse/core";

const { counter, reset, pause, resume } = useInterval(100, { controls: true });
const props = defineProps(["start"]);
const emits = defineEmits(["result-time"]);

watchEffect(() => {
  if (counter.value) {
    // 1 это 0,1 секунды
    emits("result-time", counter.value / 10);
  }
});

watchEffect(() => {
  if (props.start) {
    resume();
  } else if (!props.start) {
    emits("result-time", counter.value);
    pause();
    reset();
  }
});
</script>
