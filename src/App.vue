<template>
  <main class="font-golos">
    <div class="text-center font-bold text-2xl text-gray-600 underline">
      <CountdownTimer
        :start="isTimerStarted"
        @result-time="(seconds) => setResultTime(seconds)"
      />
      <p>wpm: {{ Math.round(wpm) }}</p>
      <p>инпут: {{ isInputFocused }}</p>
    </div>
    <div class="grid grid-cols-1 w-[95vw] m-auto mt-28">
      <div
        v-show="!isInputFocused"
        class="row-start-1 col-start-1 self-center m-auto text-gray-600"
      >
        Клик здесь для фокуса
      </div>
      <div
        class="row-start-1 col-start-1 w-full m-auto p-10 flex flex-wrap gap-6 whitespace-pre"
        :class="[isInputFocused ? 'blur-none' : 'blur-sm']"
        @click="setFocus"
      >
        <div
          ref="carret"
          v-show="isInputFocused"
          style="
            position: absolute;
            width: 2px;
            height: 48px;
            background-color: purple;
          "
          :style="{
            left: carretCoordinates.left + 'px',
            top: carretCoordinates.top + 'px',
          }"
          class="transition-[left,top] motion-reduce:transition-none motion-safe:animate-blink"
        ></div>
        <div
          v-for="(word, i) in wordsQueue"
          ref="words"
          :key="i"
          class="word flex"
        >
          <span
            v-for="(letter, idx) in word"
            ref="letter"
            :key="idx"
            class="text-2xl w-6 flex place-content-center"
            :class="[
              isInputedCharCorrect(idx) && isCurrentWord(i)
                ? 'text-green-600'
                : isInputExist(idx) &&
                  !isInputedCharCorrect(idx) &&
                  isCurrentWord(i)
                ? 'text-red-300'
                : isWordTyped(i)
                ? '!text-green-600'
                : 'text-gray-500',
            ]"
          >
            {{ letter }}
          </span>
        </div>
        <form class="absolute opacity-0">
          <input
            ref="input"
            type="text"
            v-model="currentInput"
            placeholder="Начни писать, чтобы начать тест"
          />
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, useTemplateRef, onMounted } from "vue";
import { computed, watchEffect } from "vue";
import { useMagicKeys, useFocus } from "@vueuse/core";
import CountdownTimer from "./components/CountdownTimer.vue";

const { space } = useMagicKeys();
const words = useTemplateRef("words");
const input = useTemplateRef("input");

const carretCoordinates = ref({
  left: 0,
  top: 0,
});

// "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
const text = ref(
  "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
);

const totalCharsAmount = computed(() => {
  // часть формулы (total_amount_of_chars / 5)
  return text.value.split("").length / 5;
});

// для проверки ставлю стартовое значение на 15
const resultTime = ref(15);
function setResultTime(seconds) {
  resultTime.value = 60 - seconds;
}

const normalizedTime = computed(() => {
  // часть формулы время_на_тест_в_секундах / 60
  return resultTime.value / 60;
});

const wpm = computed(() => {
  console.log(normalizedTime.value);
  return totalCharsAmount.value / normalizedTime.value;
});

const wordsQueue = computed(() => {
  return text.value.split(" ");
});
const currentWordIndex = ref(0);
const currentWord = computed(() => {
  return wordsQueue.value[currentWordIndex.value];
});
const currentInput = ref("");
let currentInputLength = currentInput.value.length;

const { focused: isInputFocused } = useFocus(input, { initialValue: false });

function setFocus() {
  isInputFocused.value = true;
}

const trimmedInput = computed(() => {
  return currentInput.value.trimStart();
});
let trimmedInputLength = trimmedInput.value.length;

const isCurrentInputCorrect = computed(() => {
  return currentWord.value === trimmedInput.value;
});

function isWordTyped(index) {
  return index < currentWordIndex.value;
}

function isInputedCharCorrect(index) {
  return currentWord.value[index] === trimmedInput.value[index];
}

function isCurrentWord(index) {
  return currentWordIndex.value === index;
}

function isInputExist(index) {
  return trimmedInput.value[index];
}

function setCarretCoordinates() {
  carretCoordinates.value.left =
    words.value[currentWordIndex.value].getBoundingClientRect().left;
  carretCoordinates.value.top =
    words.value[currentWordIndex.value].getBoundingClientRect().top;
}

const isInputGetsBigger = computed(() => {
  const inputGetsBigger = currentInput.value.length > currentInputLength;
  const inputGetsSmaller = trimmedInput.value.length < trimmedInputLength;
  currentInputLength = currentInput.value.length;
  trimmedInputLength = trimmedInput.value.length;
  return inputGetsBigger ? true : inputGetsSmaller ? false : null;
});

// const wpm = ref(0);

const isTimerStarted = ref(false);

function startTimer() {
  isTimerStarted.value = true;
}

function stopTimer() {
  isTimerStarted.value = false;
}

watchEffect(() => {
  if (trimmedInput.value.length > 0) {
    startTimer();
  }
});

// движение carret по слову
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

const lastWordIndex = wordsQueue.value.length - 1;
// если последняя слово равно currentWordIndex
// то кончаем тест
// пробел, переход на следующее слово при нажатии пробела
watchEffect(() => {
  if (isCurrentInputCorrect.value && space.value) {
    currentInput.value = "";
    currentWordIndex.value += 1;
    setCarretCoordinates();
  } else if (space.value && lastWordIndex === currentWordIndex.value) {
    stopTimer();
    setResultTime();
    console.log("test ended");
  }
});

onMounted(() => {
  setCarretCoordinates();
});
</script>

<style>
/*
*/
</style>
