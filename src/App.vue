<template>
  <main
    class="bg-secondary font-jet-brains grid place-content-center place-items-center h-dvh transition-colors"
    :class="[colorTheme === 'bushido' ? 'bushido' : 'lil-dragon']"
  >
    <CountdownTimer
      :start="isTimerStarted"
      @result-time="(seconds) => setResultTime(seconds)"
    />
    <ResultsDisplay
      :total-words-amount="totalWords"
      :written-chars-amount="writtenCharsAmount"
      :written-words-amount="writtenWordsAmount"
      :total-chars="totalChars"
      :wpm="displayedWpm"
      :mistakes="mistakes.length"
    />
    <div
      ref="carret-parent"
      class="relative w-dvw flex p-10 gap-6 overflow-hidden"
      @click="setFocus"
    >
      <div
        ref="carret"
        v-show="isInputFocused"
        style="position: absolute; width: 4px; border-radius: 4px; height: 36px"
        :style="caretStyle"
        class="transition-[left,top] motion-reduce:transition-none motion-safe:animate-blink bg-caret"
      ></div>
      <div
        v-show="!isInputFocused"
        class="absolute top-1/2 w-full text-center text-helper"
      >
        Клик здесь для фокуса или нажмите любую кнопку
      </div>
      <div
        class="words-wrapper text-3xl text-primary flex gap-6 transition-all"
        :class="[isInputFocused ? 'blur-none' : 'blur-sm']"
        :style="testMarginLeft"
      >
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
            class="w-6 flex place-content-center"
            :class="[
              isInputedCharCorrect(idx) && isCurrentWord(i)
                ? 'text-helper'
                : isInputExist(idx) &&
                  !isInputedCharCorrect(idx) &&
                  isCurrentWord(i)
                ? 'text-error'
                : isWordTyped(i)
                ? 'text-helper'
                : 'text-text',
            ]"
          >
            {{ letter }}
          </span>
          <!-- extra chars -->
          <span
            v-show="isCurrentWord(i)"
            v-for="(extra, index) in extraLetters"
            :key="index"
            class="w-6 flex place-content-center text-error"
          >
            {{ extra }}
          </span>
          <!-- extra chars -->
        </div>
      </div>
      <form class="absolute opacity-0" @submit.prevent>
        <input
          ref="input"
          type="text"
          v-model="currentInput"
          placeholder="Начни писать, чтобы начать тест"
        />
      </form>
    </div>
    <KeymapLayout />
    <div>
      <p class="text-text text-xs mt-10">
        <span class="bg-bg p-1">enter</span> - начать заново
      </p>
      <p class="text-text text-xs mt-4">
        <span class="bg-bg p-1">ctrl + x</span> - отображать строкой
      </p>
      <p class="text-text text-xs mt-4">
        <span class="bg-bg p-1">ctrl + z</span> - отображать параграфом
      </p>
      <p class="text-text text-xs mt-4">
        <span class="bg-bg p-1">ctrl + a</span> - сменить цветовую тему
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, useTemplateRef, onMounted } from "vue";
import { computed, watchEffect } from "vue";
import {
  useMagicKeys,
  useFocus,
  useElementBounding,
  whenever,
} from "@vueuse/core";
import KeymapLayout from "./components/KeymapLayout.vue";
import CountdownTimer from "./components/CountdownTimer.vue";
import ResultsDisplay from "./components/ResultsDisplay.vue";

const { space, enter, current, ControlLeft_z, ControlLeft_x, ControlLeft_a } =
  useMagicKeys();

const words = useTemplateRef("words");
const totalWords = ref(null);
function defineTotalWordsAmount() {
  totalWords.value = words.value.length;
}
const input = useTemplateRef("input");
const carretParent = useTemplateRef("carret-parent");
const { left, top, width } = useElementBounding(carretParent);

const carretCoordinates = ref({
  left: 0,
  top: 0,
});
const tapeMarginLeft = ref(0);
const testMarginLeft = computed(() => {
  return currentMode.value === "tape"
    ? { marginLeft: width.value / 2 - tapeMarginLeft.value + "px" }
    : {
        marginLeft: 0,
        flexWrap: "wrap",
      };
});
const caretStyle = computed(() => {
  return currentMode.value === "tape"
    ? { left: "calc(50% + 40px)" }
    : {
        left: carretCoordinates.value.left + "px",
        top: carretCoordinates.value.top + "px",
      };
});

// "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
const text = ref(
  "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
);
const totalChars = computed(() => {
  return text.value.split("").length;
});

const currentMode = ref("classic");
function setTapeMode() {
  // console.log("ctrl z");
  currentMode.value = "tape";
  setTimeout(() => {
    reset();
  }, 150);
}
function setClassicMode() {
  currentMode.value = "classic";
  setTimeout(() => {
    reset();
  }, 150);
}

const colorTheme = ref("bushido");
function toggleColorTheme() {
  console.log("oh hi");
  if (colorTheme.value === "bushido") {
    colorTheme.value = "lil-dragon";
  } else {
    colorTheme.value = "bushido";
  }
}

whenever(ControlLeft_z, () => setTapeMode());
whenever(ControlLeft_x, () => setClassicMode());
whenever(ControlLeft_a, () => toggleColorTheme());

const mistakes = ref([]);
// what char should i write
const nextChar = computed(() => {
  return currentWord.value[trimmedInput.value.length];
});
// what char i wrote
const prevChar = computed(() => {
  return trimmedInput.value[trimmedInput.value.length - 1];
});

const writtenWords = ref([]);
const writtenCharsAmount = computed(() => {
  return writtenWords.value.join("").split("").length;
});
const writtenWordsAmount = computed(() => {
  return writtenWords.value.length;
});

const totalCharsAmount = computed(() => {
  // часть формулы (total_amount_of_chars / 5)
  return writtenWords.value.join("").split("").length / 5;
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
  return totalCharsAmount.value / normalizedTime.value;
});
const displayedWpm = computed(() => {
  return isNaN(wpm.value) || !isFinite(wpm.value) ? 0 : Math.round(wpm.value);
});
// слова
const wordsQueue = computed(() => {
  return text.value.split(" ");
});
const currentWordIndex = ref(0);
const currentWord = computed(() => {
  return wordsQueue.value[currentWordIndex.value];
});
const currentInput = ref("");
let currentInputLength = currentInput.value.length;
const trimmedInput = computed(() => {
  return currentInput.value.trimStart();
});
let trimmedInputLength = trimmedInput.value.length;
const isCurrentInputCorrect = computed(() => {
  return currentWord.value === trimmedInput.value;
});
const extraLetters = ref([]);
const isExtraLetters = computed(() => {
  return trimmedInput.value.length > currentWord.value.length;
});

function reset() {
  currentInput.value = "";
  currentWordIndex.value = 0;
  writtenWords.value = [];
  setCarretCoordinates();
  stopTimer();
}

whenever(enter, () => reset());

const { focused: isInputFocused } = useFocus(input, { initialValue: false });

function setFocus() {
  isInputFocused.value = true;
}

watchEffect(() => {
  if (current.size > 0 && !isInputFocused.value) {
    setFocus();
    setTimeout(() => {
      currentInput.value = "";
    }, 1);
  }
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

const isCharMistake = computed(() => {
  return currentWord.value[trimmedInput.value.length - 1] !== prevChar.value;
});

watchEffect(() => {
  if (isCharMistake.value) {
    mistakes.value.push("mistake");
  }
});
function setCarretCoordinates() {
  // - [x] В зависимости от мода classic / tape, координаты должны выставляться по разному
  if (currentMode.value === "tape") {
    tapeMarginLeft.value =
      (writtenWords.value.join("").split("").length +
        writtenWords.value.length) *
      24;
  }
  if (currentMode.value === "classic") {
    carretCoordinates.value.left =
      words.value[currentWordIndex.value].getBoundingClientRect().left -
      left.value;
    carretCoordinates.value.top =
      words.value[currentWordIndex.value].getBoundingClientRect().top -
      top.value;
  }
}

const isInputGetsBigger = computed(() => {
  const inputGetsBigger = trimmedInput.value.length > trimmedInputLength;
  const inputGetsSmaller = trimmedInput.value.length < trimmedInputLength;
  currentInputLength = currentInput.value.length;
  trimmedInputLength = trimmedInput.value.length;
  return inputGetsBigger ? true : inputGetsSmaller ? false : null;
});

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
    if (isExtraLetters.value) {
      const diff = trimmedInput.value.length - currentWord.value.length;
      let extra = [
        ...trimmedInput.value.slice(
          currentWord.value.length,
          currentWord.value.length + diff
        ),
      ];
      if (extra.length === 0) {
        extraLetters.value.push(" ");
        mistakes.value.push("extra");
      } else {
        extraLetters.value.push(extra[extra.length - 1]);
        mistakes.value.push("extra");
      }
    } else {
      // currentlyAtCharIndex.value += 1;
    }
    // - [x] в зависимости от мода classic / tape, происходят разные действия
    if (currentMode.value === "tape") {
      tapeMarginLeft.value += 24;
    } else if (currentMode.value === "classic") {
      carretCoordinates.value.left += 24;
    }
  } else if (!isInputGetsBigger.value) {
    if (trimmedInput.value.length > 0) {
      // - [x] в зависимости от мода classic / tape, происходят разные действия
      if (currentMode.value === "tape") {
        tapeMarginLeft.value -= 24;
      } else if (currentMode.value === "classic") {
        carretCoordinates.value.left -= 24;
      }
    }
    if (trimmedInput.value.length === 0) {
      // - [x] в зависимости от мода classic / tape, происходят разные действия
      extraLetters.value = [];
      setCarretCoordinates();
    }
    if (extraLetters.value.length > 0) {
      extraLetters.value.pop();
    }
  }
});

const lastWordIndex = wordsQueue.value.length - 1;
const isTestEnded = computed(() => {
  return (
    lastWordIndex === currentWordIndex.value && isCurrentInputCorrect.value
  );
});

watchEffect(() => {
  if (isTestEnded.value) {
    stopTimer();
    setResultTime();
    writtenWords.value.push(currentWord.value);
    console.log("test ended");
  } else if (isCurrentInputCorrect.value && space.value) {
    writtenWords.value.push(currentWord.value);
    currentInput.value = "";
    currentWordIndex.value += 1;
    setCarretCoordinates();
  }
});

onMounted(() => {
  setCarretCoordinates();
  defineTotalWordsAmount();
});
</script>

<style>
/*
=====================
ПРОБЛЕМА: wpm как-то неверно считает, что ли
- [ ] решить

ПРОБЛЕМА: Геймплей 
1) - [ ] Отображать второй caret, что двигается на постоянной скорости
Возможны какие-то вопросы по smoot движению. Их я опускаю если не получается.
   - [ ] Наблюдать за поведением кареты на monkeytype и typeracer
   - [ ] Описывать свои предположения о решении и их решение на основе увиденного, 
         чтобы понимать, что работает, а что нет
         и не ходить по кругу.
         
*/
</style>
