<template>
  <div
    class="select-none h-[85vh] grid place-content-center place-items-center grid-rows-[1fr_auto_1fr] px-4"
    :class="isTestStarted ? 'cursor-none' : 'cursor-default'"
  >
    <div class="place-self-end justify-self-center">
      <CountdownTimer
        :start="isTestStarted"
        @result-time="(seconds) => setResultTime(seconds)"
      />
      <ResultsDisplay
        :accuracy="accuracy"
        :wpm="displayedWpm"
        :total-words-amount="totalWordsAmount"
        :written-words-amount="writtenWordsAmount"
        :final-accuracy="finalAccuracy"
        :final-result-wpm="bestResult"
        :is-test-started="isTestStarted"
      />
    </div>
    <div :class="appearanceStore.isTapeMode ? 'tape-mask-image w-dvw' : ''">
      <div
        ref="caret-parent"
        class="relative flex overflow-x-hidden overflow-y-hidden gap-6 py-4 h-[164px]"
        @click="setFocus"
      >
        <FocusWarning :is-input-focused="isInputFocused" />
        <div
          ref="caret"
          v-show="isInputFocused"
          style="
            position: absolute;
            width: 4px;
            border-radius: 4px;
            height: 36px;
          "
          :style="caretStyle"
          class="transition-[left,top] duration-75 bg-caret"
          :class="[
            isTestStarted
              ? ''
              : 'motion-reduce:transition-none motion-safe:animate-blink',
          ]"
        ></div>
        <div
          ref="paceCaret"
          style="
            position: absolute;
            width: 16px;
            background-color: white;
            opacity: 0.125;
            height: 36px;
          "
          :style="{ left: `${caretPaceL}px`, top: `${caretPaceTop}px` }"
        ></div>
        <WordsWrapper
          :is-input-focused="isInputFocused"
          :words-wrapper-style="wordsWrapperStyle"
        >
          <div
            v-for="(word, i) in wordsQueue"
            ref="words"
            :key="i"
            class="flex"
          >
            <span
              v-for="(letter, idx) in word"
              ref="letter"
              :key="idx"
              class="w-4 xl:w-6 flex place-content-center"
              :class="[
                colorThemeStore.isPresetMode &&
                isInputedCharCorrect(idx) &&
                isCurrentWord(i)
                  ? 'motion-safe:animate-colorChange'
                  : isInputedCharCorrect(idx) && isCurrentWord(i)
                  ? 'text-helper'
                  : isInputExist(idx) &&
                    !isInputedCharCorrect(idx) &&
                    isCurrentWord(i)
                  ? 'text-error'
                  : colorThemeStore.isPresetMode && isWordTyped(i)
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
            autocapitalize="off"
            autocorrect="off"
            autocomplete="off"
            v-model="currentInput"
            placeholder="Начни писать, чтобы начать тест"
          />
        </form>
      </div>
      <KeymapLayout v-if="appearanceStore.isKeymapShown" />
    </div>
    <footer
      class="place-self-start justify-self-center grid gap-2 place-items-center py-2"
    >
      <div class="flex">
        <button
          @click="reset"
          class="size-7 rounded-sm transition-colors text-text hover:text-sub"
        >
          <i class="fa-solid fa-repeat"></i>
        </button>
        <button
          @click="toggleMode"
          class="size-7 rounded-sm transition-colors text-text hover:text-sub"
        >
          <i class="fa-regular fa-keyboard"></i>
        </button>
      </div>
      <ShortcutsDescription />
    </footer>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted } from "vue";
import { computed, watchEffect, watch } from "vue";
import {
  useMagicKeys,
  useFocus,
  useElementBounding,
  useTransition,
  TransitionPresets,
  whenever,
} from "@vueuse/core";
import { quotes } from "@/assets/quotes";
import KeymapLayout from "../components/KeymapLayout.vue";
import CountdownTimer from "../components/CountdownTimer.vue";
import ResultsDisplay from "../components/ResultsDisplay.vue";
import FocusWarning from "../components/FocusWarning.vue";
import WordsWrapper from "../components/WordsWrapper.vue";
import ShortcutsDescription from "@/components/ShortcutsDescription.vue";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useAppearanceStore } from "@/store/appearanceStore";
import { useCaretStore } from "@/store/caretStore";

const colorThemeStore = useColorThemeStore();
const appearanceStore = useAppearanceStore();
const caretStore = useCaretStore();
const {
  ControlLeft_Enter,
  ControlLeft_z,
  ControlLeft_Backspace,
  Backspace,
  current,
} = useMagicKeys();
const mainDiv = useTemplateRef("main");
const words = useTemplateRef("words");
const letters = useTemplateRef("letter");
const input = useTemplateRef("input");
const caretParent = useTemplateRef("caret-parent");
const { left, top, width } = useElementBounding(caretParent);
const { width: mainDivWidth } = useElementBounding(mainDiv);
const currentWordIndex = ref(0);
const currentInput = ref("");
const finalAccuracy = ref(0);
const widthLetter = ref(null);
const totalWords = ref(null);
const resultTime = ref(0);
const { focused: isInputFocused } = useFocus(input, { initialValue: false });
const bestResult = ref(0);
const writtenWords = ref([]);
const isTestStarted = ref(false);
const extraLetters = ref([]);
const upperRowLength = ref(0);
const centerRow = ref(0);
const text = ref(
  "It's a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there's no knowing where you might be swept off to."
);
const mistakes = ref([]);
const caretCoordinates = ref({
  left: 0,
  top: 0,
});
const tapeMarginLeft = ref(0);
const classicMarginTop = ref(0);
function defineTotalWordsAmount() {
  totalWords.value = words.value.length;
}

const totalWordsAmount = computed(() => {
  return text.value.split(" ").length;
});
const classicModeStyles = computed(() => {
  return {
    marginLeft: "unset",
    marginTop: classicMarginTop.value + "px",
    flexWrap: "wrap",
    overflow: "hidden",
    // height: 148 + "px",
  };
});
const rowNumber = computed(() => {
  return caretCoordinates.value.top === rows.value[0]
    ? "1"
    : caretCoordinates.value.top === rows.value[1]
    ? "2"
    : caretCoordinates.value.top === rows.value[2]
    ? "3"
    : "wrong calc";
});
const wordsWrapperStyle = computed(() => {
  return appearanceStore.isTapeMode
    ? {
        marginLeft: width.value / 2 - tapeMarginLeft.value + "px",
      }
    : classicModeStyles.value;
});
function setWidthLetter() {
  widthLetter.value = useElementBounding(letters.value[0]);
}

const caretStyle = computed(() => {
  return appearanceStore.isTapeMode
    ? { left: "calc(50%)" }
    : {
        left: caretCoordinates.value.left + "px",
        top: caretCoordinates.value.top + "px",
      };
});
const lastWrittenChar = computed(() => {
  return trimmedInput.value[trimmedInput.value.length - 1];
});
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
const normalizedTime = computed(() => {
  return resultTime.value / 60;
});
const wpm = computed(() => {
  return normalizedWordsAmount.value / normalizedTime.value;
});
const displayedWpm = computed(() => {
  return isNaN(wpm.value) || !isFinite(wpm.value) ? 0 : Math.round(wpm.value);
});
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
const wordsQueue = computed(() => {
  return text.value.split(" ");
});

const quotesArr = [...quotes];
function getQueueQoute() {
  const currQuote = quotesArr.pop();
  quotesArr.unshift(currQuote);
  return currQuote.text;
}
function setResultTime(seconds) {
  resultTime.value = seconds;
}

const isSpaceEntered = computed(() => {
  return currentInput.value[currentInput.value.length - 1] === " ";
});
const currentWord = computed(() => {
  return wordsQueue.value[currentWordIndex.value];
});
const trimmedInput = computed(() => {
  return currentInput.value.trimStart();
});
const isCurrentInputCorrect = computed(() => {
  return currentWord.value + " " === trimmedInput.value;
});
const isExtraLetters = computed(() => {
  return trimmedInput.value.length > currentWord.value.length;
});
const lastWordIndex = computed(() => {
  return wordsQueue.value.length - 1;
});
const isTestEnded = computed(() => {
  return (
    lastWordIndex.value === currentWordIndex.value &&
    currentWord.value === trimmedInput.value
  );
});
const isCharMistake = computed(() => {
  return (
    currentWord.value[trimmedInput.value.length - 1] !== lastWrittenChar.value
  );
});

function reset() {
  text.value = getQueueQoute();
  clearCurrentInput();
  currentWordIndex.value = 0;
  writtenWords.value = [];
  stopWpmTest();
  resetCaretPace();
  classicMarginTop.value = 0;
  rows.value = getRowsCoords();
  setTimeout(() => {
    setCaretCoordinates();
  }, 100);
  if (colorThemeStore.isPresetMode) {
    colorThemeStore.setRandomTheme();
  }
}
function setFocus() {
  isInputFocused.value = true;
}
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
function setPaceCaretCoords() {
  // верхний ряд должен быть 0, но из-за паддинга это 16
  // const topCoord =
  //   words.value[currentWordIndex.value].getBoundingClientRect().top - top.value;
  caretPaceLeft.value = 0;
  caretPaceTop.value = 16;
}
function setCaretCoordinates(leftArg, topArg) {
  if (appearanceStore.isTapeMode) {
    tapeMarginLeft.value =
      (writtenWords.value.join("").split("").length +
        writtenWords.value.length) *
      widthLetter.value.width;
  }
  if (appearanceStore.isClassicMode) {
    const leftCoord =
      words.value[currentWordIndex.value].getBoundingClientRect().left -
      left.value;
    const topCoord =
      words.value[currentWordIndex.value].getBoundingClientRect().top -
      top.value;
    caretCoordinates.value.left = leftArg ? leftArg : leftCoord;
    caretCoordinates.value.top = topArg ? topArg : topCoord;
  }
}
function startWpmTest() {
  isTestStarted.value = true;
}
function stopWpmTest() {
  isTestStarted.value = false;
}
const maxExtras = 5;
function handleAddExtra() {
  if (isExtraLetters.value) {
    const diff = trimmedInput.value.length - currentWord.value.length;
    let extra = [
      ...trimmedInput.value.slice(
        currentWord.value.length,
        currentWord.value.length + diff
      ),
    ];
    if (extraLetters.value.length < maxExtras) {
      if (extra.length === 0) {
        extraLetters.value.push(" ");
        mistakes.value.push("extra");
      } else {
        extraLetters.value.push(extra[extra.length - 1]);
        mistakes.value.push("extra");
      }
      moveCaretForward();
    }
  }
}
let currMainDivWidth = mainDivWidth.value;
function onMainDivResize() {
  if (currMainDivWidth !== mainDivWidth.value) {
    currMainDivWidth = mainDivWidth.value;
    return true;
  }
  return false;
}
function moveTapeForward() {
  tapeMarginLeft.value += widthLetter.value.width;
}
function moveTapeBackward() {
  tapeMarginLeft.value -= widthLetter.value.width;
}
function moveCaretForward() {
  caretCoordinates.value.left += widthLetter.value.width;
}
function moveCaretBackward() {
  const currWordStart =
    words.value[currentWordIndex.value].getBoundingClientRect().left -
    widthLetter.value.width;
  const newCoords = caretCoordinates.value.left - widthLetter.value.width;
  // проверка, что курсор не двигается влево за слово
  if (newCoords >= currWordStart) {
    caretCoordinates.value.left -= widthLetter.value.width;
  }
}

function setCenterRowCoordinate(y) {
  centerRow.value = y;
}
function setUpperRowLength() {
  upperRowLength.value = 0;
  for (let i = 1; i < words.value.length; i++) {
    const prev = words.value[i - 1].getBoundingClientRect().top;
    const curr = words.value[i].getBoundingClientRect().top;
    if (prev === curr) {
      upperRowLength.value += 1;
    } else {
      upperRowLength.value += 1;
      setCenterRowCoordinate(curr);
      return;
    }
  }
}

const rowEnds = ref([]);
const rowTranslateIdxs = ref([]);
function getRowsCoords() {
  const result = [];
  const ends = [];
  const idxs = [];
  for (let i = 1; i < words.value.length; i++) {
    const prev = words.value[i - 1].getBoundingClientRect().top;
    const curr = words.value[i].getBoundingClientRect().top;
    if (prev !== curr) {
      ends.push(
        words.value[i - 1].getBoundingClientRect().left +
          words.value[i - 1].getBoundingClientRect().width
      );
      result.push(prev - top.value);
      idxs.push(i);
    }
  }
  ends.push(
    words.value[words.value.length - 1].getBoundingClientRect().left +
      words.value[words.value.length - 1].getBoundingClientRect().width
  );
  result.push(
    words.value[words.value.length - 1].getBoundingClientRect().top - top.value
  );
  rowEnds.value = ends;
  rowsLength.value = ends.length;
  rowTranslateIdxs.value = idxs.slice(1);
  return result;
}

const caretPaceLeft = ref(0);
const caretPaceTop = ref(0);

function setDuration() {
  duration.value =
    Math.round(
      (text.value.split(" ").length / caretStore.selectedWpm) * 60 * 1000
    ) / rows.value.length;
  if (caretPaceIndex === rowEnds.value.length - 1) {
    duration.value =
      duration.value *
      (rowEnds.value[rowEnds.value.length - 1] / Math.max(...rowEnds.value));
  }
}
const duration = ref(null);
const rowsLength = ref(null);
const caretPaceL = useTransition(caretPaceLeft, {
  duration,
  transition: TransitionPresets.linear,
});

function resetCaretPace() {
  duration.value = 0;
  caretPaceIndex = 0;
  clearTimeout(caretPaceTimeout.value);
  setPaceCaretCoords();
}
const caretPaceTimeout = ref(null);
function moveLeft(index) {
  setDuration();
  caretPaceLeft.value = rowEnds.value[index] - left.value - 16;
}
async function moveTop() {
  duration.value = 0;
  caretPaceTop.value += rows.value[1] - rows.value[0];
  caretPaceLeft.value = 0;
}
function changeRowWithDelay(idx) {
  return new Promise((resolve) => {
    moveLeft(idx);
    caretPaceTimeout.value = setTimeout(() => {
      if (idx !== rowEnds.value.length - 1) {
        moveTop();
        resolve();
      }
    }, duration.value);
  });
}

let caretPaceIndex = 0;
async function moveCaretPace() {
  while (caretPaceIndex < rowEnds.value.length && isTestStarted.value) {
    await changeRowWithDelay(caretPaceIndex);
    caretPaceIndex++;
  }
}

const rows = ref([]);
watchEffect(() => {
  if (appearanceStore.isClassicMode) {
    setTimeout(() => {
      setUpperRowLength();
      rows.value = getRowsCoords();
    }, 175);
  }
});

whenever(ControlLeft_Enter, () => reset());
whenever(ControlLeft_z, () => {
  appearanceStore.toggleMode();
  setTimeout(() => {
    reset();
  }, 150);
});
whenever(ControlLeft_Backspace, () => {
  extraLetters.value = [];
});
watchEffect(() => {
  if (current.size > 0 && !isInputFocused.value) {
    setFocus();
    setTimeout(() => {
      clearCurrentInput();
    }, 1);
  }
});
watchEffect(() => {
  if (isCharMistake.value) {
    mistakes.value.push("mistake");
  }
});
watch(isTestStarted, (newValue) => {
  if (newValue) {
    rows.value = getRowsCoords();
    moveCaretPace();
  }
});
watchEffect(() => {
  if (trimmedInput.value.length > 0) {
    startWpmTest();
  }
});
watchEffect(() => {
  if (onMainDivResize()) {
    reset();
  }
});
watch(currentInput, (newInputValue, oldInputValue) => {
  if (newInputValue.length > oldInputValue.length) {
    handleAddExtra();
    if (appearanceStore.isTapeMode) {
      moveTapeForward();
    }
    if (appearanceStore.isClassicMode) {
      if (!isExtraLetters.value) {
        moveCaretForward();
      }
    }
  }
  if (newInputValue.length < oldInputValue.length) {
    if (appearanceStore.isTapeMode) {
      moveTapeBackward();
    }
    if (appearanceStore.isClassicMode) {
      if (Backspace.value && !ControlLeft_Backspace.value) {
        extraLetters.value.pop();
        moveCaretBackward();
      }
      if (ControlLeft_Backspace.value) {
        currentInput.value = "";
        extraLetters.value = [];
        caretCoordinates.value.left =
          words.value[currentWordIndex.value].getBoundingClientRect().left -
          widthLetter.value.width;
      }
    }
  }
});
watchEffect(() => {
  if (isTestEnded.value) {
    bestResult.value = displayedWpm.value;
    finalAccuracy.value = accuracy.value;
    stopWpmTest();
    setResultTime();
    writtenWords.value.push(currentWord.value);
    setTimeout(() => {
      reset();
    }, 75);
  }
});
watchEffect(() => {
  if (
    isCurrentInputCorrect.value &&
    isSpaceEntered.value &&
    !isTestEnded.value
  ) {
    writtenWords.value.push(currentWord.value);
    clearCurrentInput();
    currentWordIndex.value += 1;
    setCaretCoordinates();
    if (rowNumber.value === "3" && appearanceStore.isClassicMode) {
      classicMarginTop.value -= rows.value[1] - rows.value[0];
      caretPaceTop.value -= rows.value[1] - rows.value[0];
      setCaretCoordinates(0, rows.value[1]);
    }
  }
});
onMounted(() => {
  setWidthLetter();
  defineTotalWordsAmount();
  setCaretCoordinates();
  setPaceCaretCoords();
  getRowsCoords();
  text.value = getQueueQoute();
});
</script>
