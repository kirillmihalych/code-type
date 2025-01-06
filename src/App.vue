<template>
  <main class="font-golos grid place-content-center h-dvh w-[95vw] m-auto">
    <div class="text-center font-bold text-2xl text-gray-600">
      <p></p>
      <CountdownTimer
        :start="isTimerStarted"
        @result-time="(seconds) => setResultTime(seconds)"
      />
    </div>
    <p class="text-xl text-center text-gray-500">
      wpm <span class="font-bold text-blue-400">{{ displayedWpm }}</span>
    </p>
    <ResultsDisplay
      :total-words-amount="totalWords"
      :written-chars-amount="writtenCharsAmount"
      :written-words-amount="writtenWordsAmount"
      :total-chars="totalChars"
      :wpm="displayedWpm"
      :mistakes="mistakes.length"
    />
    <div class="grid grid-cols-1">
      <div
        v-show="!isInputFocused"
        class="row-start-1 col-start-1 self-center m-auto text-gray-600 opacity-75"
      >
        Клик здесь для фокуса или нажмите любую кнопку
      </div>
      <div
        ref="carret-parent"
        class="relative row-start-1 col-start-1 w-full m-auto p-10 flex flex-wrap gap-6 whitespace-pre"
        :class="[isInputFocused ? 'blur-none' : 'blur-sm']"
        @click="setFocus"
      >
        <div
          ref="carret"
          v-show="isInputFocused"
          style="
            position: absolute;
            width: 4px;
            border-radius: 4px;
            height: 36px;
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
          <!-- extra chars -->
          <span
            v-show="isCurrentWord(i)"
            v-for="(extra, index) in extraLetters"
            :key="index"
            class="text-2xl w-6 flex place-content-center text-red-500"
          >
            {{ extra }}
          </span>
          <!-- extra chars -->
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

const { space, current } = useMagicKeys();

const words = useTemplateRef("words");
const totalWords = ref(null);
function defineTotalWordsAmount() {
  totalWords.value = words.value.length;
}

const input = useTemplateRef("input");
const carretParent = useTemplateRef("carret-parent");
const { left, top } = useElementBounding(carretParent);

const carretCoordinates = ref({
  left: 0,
  top: 0,
});

// "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
const text = ref(
  "Мы писали, мы писали. Наши пальчики устали. А теперь мы отдохнем и опять писать пойдём."
);
const totalChars = computed(() => {
  return text.value.split("").length;
});
const currentlyAtCharIndex = ref(0);

const mistakes = ref([]);
// what char should i write
const nextChar = computed(() => {
  return currentWord.value[trimmedInput.value.length];
});
// what char i wrote
const prevChar = computed(() => {
  return trimmedInput.value[trimmedInput.value.length - 1];
});
// is

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
  console.log(
    "чик-пук",
    currentWord.value[trimmedInput.value.length - 1] !== prevChar.value
  );
  return currentWord.value[trimmedInput.value.length - 1] !== prevChar.value;
});

watchEffect(() => {
  if (isCharMistake.value) {
    mistakes.value.push("mistake");
  }
});
function setCarretCoordinates() {
  console.log(left.value, top.value);
  carretCoordinates.value.left =
    words.value[currentWordIndex.value].getBoundingClientRect().left -
    left.value;
  carretCoordinates.value.top =
    words.value[currentWordIndex.value].getBoundingClientRect().top - top.value;
}

const isInputGetsBigger = computed(() => {
  const inputGetsBigger = trimmedInput.value.length > trimmedInputLength;
  // const inputGetsBigger = currentInput.value.length > currentInputLength;
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
      currentlyAtCharIndex.value += 1;
    }
    carretCoordinates.value.left += 24;
  } else if (!isInputGetsBigger.value) {
    if (trimmedInput.value.length === 0) {
      extraLetters.value = [];
      setCarretCoordinates();
    } else {
      carretCoordinates.value.left -= 24;
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
    if (isInputedCharCorrect(currentlyAtCharIndex.value)) {
      currentlyAtCharIndex.value += 1;
    }
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
ПРОБЛЕМА: статистика
1) Показывать текущий char, что я должен нажать
Пример с monkeytype
1)  - [x] Отображать количество напечатанных слов в формате 1/15 и т.д.
2)  - [x] Отображать wpm (сделано)
3)  - [x] Отображать accuracy
    - [ ] Переписать логику конца теста
4)  - [x] Поставить opacity статистики на 0.75

ПРОБЛЕМА: shortcuts в приложении
1) - [ ] enter начать новую игру

ПРОБЛЕМА: Геймплей 
1) - [ ] Отображать второй caret, что двигается на постоянной скорости
Возможны какие-то вопросы по smoot движению. Их я опускаю если не получается.
   - [ ] Наблюдать за поведением кареты на monkeytype и typeracer
   - [ ] Описывать свои предположения о решении и их решение на основе увиденного, 
         чтобы понимать, что работает, а что нет
         и не ходить по кругу 

ПРОБЛЕМА: стиль
    - [ ] Найти интересный цветовой стиль и скопировать его
1)  - [ ] Скопировать стиль с monkeytype но изменить цвета для себя
          Держать в уме, что дальше буду делать themes для приложения
2) -  [ ] Добавить иконки для статистики и других всех описаний
3) -  [ ] Сделать светлую и тёмную тему для приложения

ПРОБЛЕМА: анимация
monkeytype > appearance > tape mode
1) - [ ] Сделать текст бегущей строкой, что двигается по букве
2) - [ ] Дать возможность переключаться между стандартным режимом отображения и бегущей строкой
*/
</style>
