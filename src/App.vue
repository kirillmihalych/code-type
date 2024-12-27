<template>
  <main>
    <div class="bg-grey-500 h-dvh flex items-center justify-center">
      <div>
        <div>queue: {{ queue[0] }}{{ queue[1] }}</div>
        <div>current position: {{ currentPosition }}</div>
        <div>
          первый символ совпадение: {{ userInput[0] }}{{ queue[0]
          }}{{ userInput[0] === queue[0] }}
        </div>
        <div>user input: {{ userInput }}</div>
        <div>{{ isInputCorrect }}</div>
        <input type="text" v-model="userInput" />
      </div>
      <div class="border-4 border-green-800 p-10 flex whitespace-pre">
        <div
          v-for="(letter, i) in queue"
          :key="i"
          :class="[
            userInput[i] === queue[i] ? 'text-green-500' : 'text-gray-500',
          ]"
        >
          {{ letter }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "vue";

// , мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём.
const text = ref("Мы писали.");

const userInput = ref("");
const currentPosition = computed(() => {
  return userInput.value.length
    ? userInput.value.length - 1
    : userInput.value.length;
});

const queue = computed(() => {
  return text.value.split("");
});

const isInputCorrect = computed(() => {
  return (
    userInput.value[currentPosition.value] ===
    queue.value[currentPosition.value]
  );
});
</script>
