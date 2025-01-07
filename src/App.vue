<template>
  <main
    class="lil-dragon bg-secondary font-jet-brains grid place-content-center h-dvh"
  >
    <div class="text-center font-bold text-2xl text-gray-600">
      <CountdownTimer
        :start="isTimerStarted"
        @result-time="(seconds) => setResultTime(seconds)"
      />
    </div>
    <ResultsDisplay
      :total-words-amount="totalWords"
      :written-chars-amount="writtenCharsAmount"
      :written-words-amount="writtenWordsAmount"
      :total-chars="totalChars"
      :wpm="displayedWpm"
      :mistakes="mistakes.length"
    />
    <div class="grid grid-cols-1 overflow-hidden">
      <div
        v-show="!isInputFocused"
        class="row-start-1 col-start-1 self-center m-auto text-gray-600 opacity-75"
      >
        Клик здесь для фокуса или нажмите любую кнопку
      </div>
      <!-- relative row-start-1 col-start-1 whitespace-pre p-10-->
      <!-- style="width: 200vw" -->
      <!-- transition-all -->
      <div
        ref="carret-parent"
        class="w-dvw p-10 flex gap-6 overflow-hidden"
        :class="[isInputFocused ? 'blur-none' : 'blur-sm']"
        @click="setFocus"
      >
        <!-- :style="{
          marginLeft: calc(50 % -(tapeMarginLeft + 'px')),
        }" -->
        <!-- :style="{
          marginLeft: tapeMarginLeft === 0 ? 50 + '%' : tapeMarginLeft + 'px',
        }" -->
        <div
          ref="carret"
          v-show="isInputFocused"
          style="
            position: absolute;
            width: 4px;
            border-radius: 4px;
            height: 36px;
            /* top: 50%; */
            left: calc(50% + 40px);
          "
          class="transition-[left,top] motion-reduce:transition-none motion-safe:animate-blink bg-caret"
        ></div>
        <!-- :style="{
            left: carretCoordinates.left + 'px',
            top: carretCoordinates.top + 'px',
          }" -->
        <div
          class="words-wrapper flex gap-6 transition-all"
          :style="{ marginLeft: testMarginLeft }"
        >
          <div
            v-for="(word, i) in wordsQueue"
            ref="words"
            :key="i"
            class="word flex text-3xl text-primary"
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
    </div>
    <KeymapLayout />
    <div>
      <KeyLayout
        :value="enter"
        style="width: 5rem; margin: 0 auto; margin-top: 1rem"
      >
        Enter
      </KeyLayout>
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
import KeyLayout from "./components/KeyLayout.vue";

const { space, enter, current } = useMagicKeys();

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
  return width.value / 2 - tapeMarginLeft.value + "px";
});

// "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
const text = ref(
  "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
);
const totalChars = computed(() => {
  return text.value.split("").length;
});
// const currentlyAtCharIndex = ref(0);

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
  // - [ ] В зависимости от мода classic / tape, координаты должны выставляться по разному
  //
  // carretCoordinates.value.left =
  //   words.value[currentWordIndex.value].getBoundingClientRect().left -
  //   left.value;
  // carretCoordinates.value.top =
  //   words.value[currentWordIndex.value].getBoundingClientRect().top - top.value;
  tapeMarginLeft.value =
    (writtenWords.value.join("").split("").length + writtenWords.value.length) *
    24;

  console.log("coordinates setted");
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
    // - [ ] в зависимости от мода classic / tape, происходят разные действия
    tapeMarginLeft.value += 24;
    // carretCoordinates.value.left += 24;
  } else if (!isInputGetsBigger.value) {
    if (trimmedInput.value.length >= 0) {
      // - [ ] в зависимости от мода classic / tape, происходят разные действия
      tapeMarginLeft.value -= 24;
    }
    if (trimmedInput.value.length === 0) {
      // - [ ] в зависимости от мода classic / tape, происходят разные действия
      // carretCoordinates.value.left -= 24;
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
Что происходит, когда я жму ctrl + backspace
1) стирается всё слово или до пробела, или знака припинания
2) то есть инпут будет пустым
Но инпут пустой ещё, когда я перехожу к другому слову
3) раньше, когда инпут был пустым, я устанавливал координаты caret в начало слова

теперь у меня caret стоит на месте
и я должен двинуть его так, чтобы текущее слова встало на caret
Как?
1) попробовать посчитать количество символов 


=====================
ПРОБЛЕМА: Геймплей 
1) - [ ] Отображать второй caret, что двигается на постоянной скорости
Возможны какие-то вопросы по smoot движению. Их я опускаю если не получается.
   - [ ] Наблюдать за поведением кареты на monkeytype и typeracer
   - [ ] Описывать свои предположения о решении и их решение на основе увиденного, 
         чтобы понимать, что работает, а что нет
         и не ходить по кругу.
         
ПРОБЛЕМА: анимация
monkeytype > appearance > tape mode
1) - [ ] Сделать текст бегущей строкой, что двигается по букве
2) - [ ] Дать возможность переключаться между стандартным режимом отображения и бегущей строкой
*/
</style>
