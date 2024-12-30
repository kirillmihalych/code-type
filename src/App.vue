<template>
  <main class="font-golos">
    <div class="bg-grey-500 h-dvh w-[95vw] m-auto mt-28">
      <!-- v-if="isResultShown" -->
      <div class="text-center font-bold text-2xl text-gray-600 underline">
        <p>инпут: {{ userInput.length }}</p>
        <p>позиция: {{ currentPosition }}</p>
        <p>Твой wpm {{ result }}</p>
      </div>
      <div class="relative w-full p-10 flex flex-wrap whitespace-pre">
        <!-- carret -->
        <div
          ref="carret"
          style="
            position: absolute;
            width: 2px;
            height: 48px;
            background-color: purple;
          "
          :style="{ left: carretCoordinates.left + 'px' }"
        ></div>
        <!-- carret -->
        <div
          v-for="(letter, i) in queue"
          ref="letter"
          :key="i"
          class="text-2xl grow-0 shrink-0 basis-6 flex place-content-center"
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
import { ref, onMounted, useTemplateRef, watch } from "vue";
import { computed, watchEffect } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";

const { backspace } = useMagicKeys();

const carret = useTemplateRef("carret");

const userInput = ref("");
let userInputLength = userInput.value.length;

const isInputGetsBigger = computed(() => {
  // [x] создать не реактивную переменную, котора будет говорить длину инпута
  // [x] обновлять её вручную
  // [x] отдавать true или false в случае движения
  // [ ] отдавать null в случае простоя
  const inputGetsBigger = userInput.value.length > userInputLength;
  const inputGetsSmaller = userInput.value.length < userInputLength;
  const inputStaysTheSame = userInput.value.length === userInputLength;
  userInputLength = userInput.value.length;
  return inputGetsBigger ? true : inputGetsSmaller ? false : null;
});

// если
const currentPosition = computed(() => {
  return userInput.value.length ? userInput.value.length - 1 : 1;
});

function putCarretOnStart() {
  carretCoordinates.value.left = 40;
}

const carretCoordinates = ref({
  left: 40,
  top: 0,
});

const letter = ref(null);
// "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
const text = ref("Слово записано.");

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
    putCarretOnStart();
    userInput.value = "";
    isResultShown.value = true;
    userInputLength = 0;
    startTestTime.value = 0;
    endTestTime.value = 0;
  }
});

// если пользователь начал вводить что-то,
// то запускается таймер
watchEffect(() => {
  if (userInput.value.length === 0) {
    startTestTime.value = 0;
  }
});

// движение вперёд
watchEffect(() => {
  // current position
  if (isInputGetsBigger.value === null) {
    console.log("hi there");
  } else if (isInputGetsBigger.value) {
    carretCoordinates.value.left += 24;
  } else if (!isInputGetsBigger.value) {
    carretCoordinates.value.left -= 24;
  }
});
</script>

<style></style>
