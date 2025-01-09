<template>
  <div></div>
</template>

<script setup>
import { watchEffect } from "vue";
import { useInterval } from "@vueuse/core";

const { counter, reset, pause, resume } = useInterval(1000, { controls: true });
const props = defineProps(["start"]);
const emits = defineEmits(["result-time"]);

watchEffect(() => {
  if (counter.value) {
    emits("result-time", counter.value);
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
