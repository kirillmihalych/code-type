<template>
  <main class="font-golos">
    <div class="bg-grey-500 h-dvh w-[95vw] m-auto grid place-content-center">
      <div
        v-if="isResultShown"
        class="text-center font-bold text-2xl text-gray-600 underline"
      >
        Твой wpm {{ result }}
      </div>
      <div class="p-10 flex flex-wrap whitespace-pre">
        <div
          v-for="(letter, i) in queue"
          :key="i"
          class="text-5xl"
          :class="[
            userInput[i] === queue[i]
              ? 'text-green-500'
              : userInput[i] && userInput[i] !== queue[i]
              ? 'text-red-500'
              : 'text-gray-500',
          ]"
        >
          {{ letter }}
        </div>
      </div>
      <form class="">
        <input
          type="text"
          v-model="userInput"
          placeholder="Начни писать, чтобы начать тест"
          class="w-full text-center"
        />
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { computed, watchEffect } from "vue";

const text = ref(
  "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
);

const userInput = ref("");

const currentPosition = computed(() => {
  return userInput.value.length
    ? userInput.value.length - 1
    : userInput.value.length;
});

const queue = computed(() => {
  return text.value.split("");
});

const isResultShown = ref(false);

let startTestTime = ref(0);
let endTestTime = ref(0);
let result = ref(0);
watchEffect(() => {
  if (userInput.value.length === 1) {
    startTestTime.value = Date.now() / 1000;
  } else if (queue.value.length - 1 === currentPosition.value) {
    endTestTime.value = Date.now() / 1000;
    const charsAmount = queue.value.length;
    const rawWpm = charsAmount / 5;
    const time = ((endTestTime.value - startTestTime.value) / 60).toFixed(2);
    result.value = Math.round(rawWpm / time);
    isResultShown.value = true;
    userInput.value = "";
    startTestTime.value = 0;
    endTestTime.value = 0;
  }
});

watchEffect(() => {
  if (userInput.value.length === 0) {
    startTestTime.value = 0;
  }
});
</script>
