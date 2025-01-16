<template>
  <main
    ref="main"
    class="fire bg-secondary font-jet-brains grid place-content-center place-items-center py-10 min-h-dvh transition-colors"
  >
    <!-- :class="[colorTheme === 'bushido' ? 'bushido' : 'lil-dragon']" -->
    <CountdownTimer
      :start="isTimerStarted"
      @result-time="(seconds) => setResultTime(seconds)"
    />
    <ResultsDisplay
      :accuracy="accuracy"
      :wpm="displayedWpm"
      :total-words-amount="totalWords"
      :written-words-amount="writtenWordsAmount"
      :final-accuracy="finalAccuracy"
      :final-result-wpm="bestResult"
    />
    <div
      ref="caret-parent"
      class="relative w-dvw flex p-10 gap-6 overflow-hidden"
      @click="setFocus"
    >
      <div
        ref="caret"
        v-show="isInputFocused"
        style="position: absolute; width: 4px; border-radius: 4px; height: 36px"
        :style="caretStyle"
        class="transition-[left,top] motion-reduce:transition-none motion-safe:animate-blink bg-caret"
      ></div>
      <FocusWarning :is-input-focused="isInputFocused" />
      <WordsWrapper
        :is-input-focused="isInputFocused"
        :words-wrapper-style="wordsWrapperStyle"
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
            class="w-4 xl:w-6 flex place-content-center"
            :class="[
              isColorThemeAnimated &&
              isInputedCharCorrect(idx) &&
              isCurrentWord(i)
                ? 'motion-safe:animate-colorChange'
                : isInputedCharCorrect(idx) && isCurrentWord(i)
                ? 'text-helper'
                : isInputExist(idx) &&
                  !isInputedCharCorrect(idx) &&
                  isCurrentWord(i)
                ? 'text-error'
                : isColorThemeAnimated && isWordTyped(i)
                ? 'motion-safe:animate-colorChange'
                : isWordTyped(i)
                ? 'text-helper'
                : 'text-text',
            ]"
          >
            {{ letter }}
          </span>
          <span
            v-show="isCurrentWord(i)"
            v-for="(extra, index) in extraLetters"
            :key="index"
            class="w-4 xl:w-6 flex place-content-center text-error"
          >
            {{ extra }}
          </span>
        </div>
      </WordsWrapper>
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
      <p class="text-text text-smallest xl:text-xs mt-10">
        <button
          @click="reset"
          class="size-6 rounded-sm bg-bg hover:bg-helper transition-colors"
        >
          <i class="fa-solid fa-repeat text-text"></i>
        </button>
        или <span class="bg-bg p-1">enter</span> - начать заново
      </p>
      <p class="text-text text-smallest xl:text-xs mt-4">
        <button
          @click="toggleMode"
          class="size-6 rounded-sm bg-bg hover:bg-helper transition-colors"
        >
          <i class="fa-regular fa-keyboard text-text"></i>
        </button>
        или <span class="bg-bg p-1">ctrl + z</span> - изменить отображение
      </p>
      <p class="text-text text-smallest xl:text-xs mt-4">
        <button
          @click="toggleColorTheme"
          class="size-6 rounded-sm bg-bg hover:bg-helper transition-colors"
        >
          <i class="fa-solid fa-palette text-text"></i>
        </button>
        или <span class="bg-bg p-1">ctrl + a</span> - сменить цветовую тему
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
import FocusWarning from "./components/FocusWarning.vue";
import WordsWrapper from "./components/WordsWrapper.vue";

const { space, enter, current, ControlLeft_z, ControlLeft_a } = useMagicKeys();
const mainDiv = useTemplateRef("main");
const { width: mainDivWidth } = useElementBounding(mainDiv);

const words = useTemplateRef("words");
const totalWords = ref(null);
function defineTotalWordsAmount() {
  totalWords.value = words.value.length;
}
const letters = useTemplateRef("letter");
const widthLetter = ref(null);
onMounted(() => {
  widthLetter.value = useElementBounding(letters.value[0]);
});
const input = useTemplateRef("input");
const caretParent = useTemplateRef("caret-parent");
const { left, top, width } = useElementBounding(caretParent);

const caretCoordinates = ref({
  left: 0,
  top: 0,
});
const tapeMarginLeft = ref(0);
const wordsWrapperStyle = computed(() => {
  return currentMode.value === "tape"
    ? {
        marginLeft: width.value / 2 - tapeMarginLeft.value + "px",
      }
    : {
        marginLeft: 0,
        flexWrap: "wrap",
      };
});
const caretStyle = computed(() => {
  return currentMode.value === "tape"
    ? { left: "calc(50% + 40px)" }
    : {
        left: caretCoordinates.value.left + "px",
        top: caretCoordinates.value.top + "px",
      };
});

// "It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to."
const text = ref(
  "It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to."
);

const currentMode = ref("tape");
const isTapeMode = computed(() => {
  return currentMode.value === "tape";
});
const isClassicMode = computed(() => {
  return currentMode.value === "classic";
});
function toggleMode() {
  currentMode.value = currentMode.value === "tape" ? "classic" : "tape";
  setTimeout(() => {
    reset();
  }, 150);
}

const colorThemes = ref([
  {
    name: "matrix",
    isAnimated: false,
  },
  {
    name: "fire",
    isAnimated: true,
  },
]);
const selectedColorTheme = computed(() => {
  return colorThemes.value[1];
});
const isColorThemeAnimated = computed(() => {
  return selectedColorTheme.value.isAnimated;
});

const colorTheme = ref("bushido");
function toggleColorTheme() {
  if (colorTheme.value === "bushido") {
    colorTheme.value = "lil-dragon";
  } else {
    colorTheme.value = "bushido";
  }
}

whenever(ControlLeft_z, () => toggleMode());
whenever(ControlLeft_a, () => toggleColorTheme());

const mistakes = ref([]);
const lastWrittenChar = computed(() => {
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
  return writtenWords.value.join("").split("").length;
});
const normalizedWordsAmount = computed(() => {
  return totalCharsAmount.value / 5;
});

const resultTime = ref(0);
function setResultTime(seconds) {
  resultTime.value = seconds;
}
const normalizedTime = computed(() => {
  return resultTime.value / 60;
});
const wpm = computed(() => {
  return normalizedWordsAmount.value / normalizedTime.value;
});
const displayedWpm = computed(() => {
  return isNaN(wpm.value) || !isFinite(wpm.value) ? 0 : Math.round(wpm.value);
});
const bestResult = ref(0);
const mistakesPercent = computed(() => {
  return Math.round(
    100 - (mistakes.value.length / writtenCharsAmount.value) * 100
  );
});
const accuracy = computed(() => {
  return isNaN(mistakesPercent.value) || !isFinite(mistakesPercent.value)
    ? "100%"
    : mistakesPercent.value < 0
    ? "0%"
    : `${mistakesPercent.value}%`;
});
const finalAccuracy = ref(0);

const wordsQueue = computed(() => {
  return text.value.split(" ");
});
const currentWordIndex = ref(0);
const currentWord = computed(() => {
  return wordsQueue.value[currentWordIndex.value];
});
const currentInput = ref("");
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
  setCaretCoordinates();
  clearCurrentInput();
  currentWordIndex.value = 0;
  writtenWords.value = [];
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
      clearCurrentInput();
    }, 1);
  }
});

function clearCurrentInput() {
  currentInput.value = "";
}

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
  return (
    currentWord.value[trimmedInput.value.length - 1] !== lastWrittenChar.value
  );
});

watchEffect(() => {
  if (isCharMistake.value) {
    mistakes.value.push("mistake");
  }
});
function setCaretCoordinates() {
  if (isTapeMode.value) {
    tapeMarginLeft.value =
      (writtenWords.value.join("").split("").length +
        writtenWords.value.length) *
      widthLetter.value.width;
  }
  if (isClassicMode.value) {
    caretCoordinates.value.left =
      words.value[currentWordIndex.value].getBoundingClientRect().left -
      left.value;
    caretCoordinates.value.top =
      words.value[currentWordIndex.value].getBoundingClientRect().top -
      top.value;
  }
}

const isInputGetsBigger = computed(() => {
  const inputGetsBigger = trimmedInput.value.length > trimmedInputLength;
  const inputGetsSmaller = trimmedInput.value.length < trimmedInputLength;
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

function handleExtraChars() {
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
  }
}

watchEffect(() => {
  if (trimmedInput.value.length > 0) {
    startTimer();
  }
});

let currMainDivWidth = mainDivWidth.value;
function onMainDivResize() {
  if (currMainDivWidth !== mainDivWidth.value) {
    currMainDivWidth = mainDivWidth.value;
    return true;
  }
  return false;
}

watchEffect(() => {
  if (onMainDivResize()) {
    reset();
  }
});

function moveCaretForward() {
  tapeMarginLeft.value += widthLetter.value.width;
}

// движение caret по слову
watchEffect(() => {
  if (isInputGetsBigger.value === null) {
    console.log("hi there");
  } else if (isInputGetsBigger.value) {
    handleExtraChars();
    if (isTapeMode.value) {
      moveCaretForward();
    } else if (isClassicMode.value) {
      caretCoordinates.value.left += widthLetter.value.width;
    }
  } else if (!isInputGetsBigger.value) {
    if (trimmedInput.value.length > 0) {
      if (isTapeMode.value) {
        tapeMarginLeft.value -= widthLetter.value.width;
      } else if (isClassicMode.value) {
        caretCoordinates.value.left -= widthLetter.value.width;
      }
    }
    if (trimmedInput.value.length === 0) {
      extraLetters.value = [];
      setCaretCoordinates();
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
    bestResult.value = displayedWpm.value;
    finalAccuracy.value = accuracy.value;
    stopTimer();
    setResultTime();
    writtenWords.value.push(currentWord.value);
    reset();
  } else if (isCurrentInputCorrect.value && space.value) {
    writtenWords.value.push(currentWord.value);
    clearCurrentInput();
    currentWordIndex.value += 1;
    setCaretCoordinates();
  }
});

onMounted(() => {
  setCaretCoordinates();
  defineTotalWordsAmount();
});
</script>
