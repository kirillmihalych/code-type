<template>
  <div>
    <p>countdown: {{ remainingTime }}</p>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps(["start"]);
const emits = defineEmits(["result-time"]);

const intervalId = ref(null);

const remainingTime = ref(60);

function countdown() {
  remainingTime.value -= 1;
}

function startTimer() {
  if (!intervalId.value) {
    intervalId.value = setInterval(countdown, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalId.value);
}

watchEffect(() => {
  if (remainingTime.value === 0) {
    clearInterval(intervalId.value);
  }
});

watchEffect(() => {
  if (props.start) {
    startTimer();
  } else if (!props.start) {
    stopTimer();
    emits("result-time", remainingTime.value);
  }
});
</script>
