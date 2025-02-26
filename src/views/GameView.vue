<template>
  <div
    class="select-none h-[85vh] grid place-content-center place-items-center grid-rows-[1fr_auto_1fr] px-4"
    :class="isTestStarted ? 'cursor-none' : 'cursor-default'"
  >
    <div class="place-self-end justify-self-center">
      <p class="text-white">
        {{ inputedChars }} {{ inputedType }} {{ currentInput }}
      </p>
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
        :result-time="resultTime"
      />
    </div>
    <div :class="appearanceStore.isTapeMode ? 'tape-mask-image w-dvw' : ''">
      <div
        ref="caret-parent"
        class="relative flex overflow-x-hidden overflow-y-hidden gap-6 py-4"
        :class="
          appearanceStore.isClassicMode
            ? 'h-[164px] lg:h-[196px] max-w-[768px]'
            : ''
        "
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
            z-index: 9999;
          "
          :style="caretStyle"
          class="transition-[left,top] duration-75 bg-caret"
          :class="[
            isTestStarted
              ? ''
              : 'motion-reduce:transition-none motion-safe:animate-blink',
          ]"
        ></div>
        <WordsWrapper
          ref="wrapper"
          :is-input-focused="isInputFocused"
          :words-wrapper-style="wordsWrapperStyle"
        >
          <div
            ref="paceCaret"
            class="absolute w-4 xl:w-6 h-9 bg-primary opacity-15"
            :style="{ left: `${caretPaceL}px`, top: `${caretPaceTop}px` }"
          ></div>
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
            v-model="currentInput"
            ref="input"
            type="text"
            autocorrect="off"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            :maxLength="maxInputLength"
          />
        </form>
      </div>
      <KeymapLayout v-if="appearanceStore.isKeymapShown" />
    </div>
    <footer class="place-self-start h-full justify-self-center grid gap-2 py-2">
      <div class="place-content-center flex lg:hidden">
        <button
          @click="reset"
          class="size-7 rounded-sm transition-colors text-text hover:text-sub"
          title="начать заново"
        >
          <i class="fa-solid fa-repeat"></i>
        </button>
        <button
          @click="toggleMode"
          class="size-7 rounded-sm transition-colors text-text hover:text-sub"
          title="сменить отображение"
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
  useEventListener,
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
const { ControlLeft_Enter, ControlLeft_z, ControlLeft_Backspace, current } =
  useMagicKeys();
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

const maxInputLength = computed(() => {
  return currentWord.value.length + maxExtras;
});
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
  return (
    writtenWords.value.join("").split("").length + writtenWords.value.length
  );
});
const normalizedWordsAmount = computed(() => {
  return Math.round(totalCharsAmount.value / 5);
});
const normalizedTime = computed(() => {
  return 60 / resultTime.value;
});
const wpm = computed(() => {
  return normalizedWordsAmount.value * normalizedTime.value;
});
const displayedWpm = computed(() => {
  return isNaN(wpm.value) || !isFinite(wpm.value) ? 0 : Math.round(wpm.value);
});
const mistakesPercent = computed(() => {
  return Math.round(
    100 -
      (mistakes.value.length /
        (mistakes.value.length + writtenCharsAmount.value)) *
        100
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
  return currentInput.value.length > currentWord.value.length;
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
  const char = currentWord.value[trimmedInput.value.length - 1];
  return char !== lastWrittenChar.value;
});

function reset() {
  text.value = getQueueQoute();
  clearCurrentInput();
  extraLetters.value = [];
  currentWordIndex.value = 0;
  writtenWords.value = [];
  mistakes.value = [];
  stopWpmTest();
  classicMarginTop.value = 0;
  rows.value = getRowsCoords();
  setTimeout(() => {
    setCaretCoordinates();
  }, 100);
  setTimeout(() => {
    resetCaretPace();
    setWidthLetter();
  }, 200);
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
  caretPaceLeft.value = 0;
  caretPaceTop.value = 0;
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
      } else {
        extraLetters.value.push(extra[extra.length - 1]);
      }
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
  if (
    isCurrentInputCorrect.value &&
    isSpaceEntered.value &&
    !isTestEnded.value
  ) {
    writtenWords.value.push(currentWord.value);
    currentInput.value = "";
    currentWordIndex.value += 1;
    extraLetters.value = [];
    tapeMarginLeft.value += widthLetter.value.width;
  } else {
    tapeMarginLeft.value += widthLetter.value.width;
  }
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
    left.value -
    widthLetter.value.width;
  const newCoords = caretCoordinates.value.left - widthLetter.value.width;
  // проверка, что курсор не двигается влево за слово
  if (newCoords >= currWordStart) {
    caretCoordinates.value.left -= widthLetter.value.width;
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
  duration.value = Math.round(
    ((text.value.split(" ").length / caretStore.selectedWpm) * 60 * 1000) /
      (rows.value.length -
        1 +
        rowEnds.value[rowEnds.value.length - 1] / Math.max(...rowEnds.value))
  );
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

const wrapper = useTemplateRef("wrapper");
function movePaceCaretOnTape() {
  duration.value = Math.round(
    (text.value.split(" ").length / caretStore.selectedWpm) * 60 * 1000
  );
  caretPaceLeft.value =
    wrapper.value.wrapper.getBoundingClientRect().width -
    widthLetter.value.width;
  caretPaceTop.value = 0;
}
function moveLeft(index) {
  setDuration();
  caretPaceLeft.value =
    rowEnds.value[index] - left.value - widthLetter.value.width;
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
  if (appearanceStore.isClassicMode) {
    while (caretPaceIndex < rowEnds.value.length && isTestStarted.value) {
      await changeRowWithDelay(caretPaceIndex);
      caretPaceIndex++;
    }
  }
  if (appearanceStore.isTapeMode) {
    movePaceCaretOnTape();
  }
}

const inputedChars = ref([]);
const inputedType = ref("");

useEventListener(input, "beforeinput", (e) => {
  if (e.data !== " ") {
    handleAddExtra();
    if (appearanceStore.isTapeMode) {
      moveTapeForward();
    }
    if (appearanceStore.isClassicMode) {
      moveCaretForward();
    }
    if (isCharMistake.value) {
      mistakes.value.push("miss");
    }
  }
  console.log(e);
});

const rows = ref([]);
watchEffect(() => {
  if (appearanceStore.isClassicMode) {
    setTimeout(() => {
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
  // if (newInputValue.length > oldInputValue.length) {
  //   handleAddExtra();
  //   if (appearanceStore.isTapeMode) {
  //     moveTapeForward();
  //   }
  //   if (appearanceStore.isClassicMode) {
  //     moveCaretForward();
  //   }
  //   if (isCharMistake.value) {
  //     mistakes.value.push("miss");
  //   }
  // }
  // вторая часть условия это проверка,
  // не перешёл ли тест на новое слово
  // этот кейс не должен обрабатываться, как уменьшение инпута
  if (
    newInputValue.length < oldInputValue.length &&
    !(oldInputValue.trim() === wordsQueue.value[currentWordIndex.value - 1])
  ) {
    if (appearanceStore.isTapeMode) {
      if (ControlLeft_Backspace.value) {
        extraLetters.value = [];
        currentInput.value = "";
        const spaces = text.value
          .split(" ")
          .slice(0, currentWordIndex.value).length;
        const chars = text.value
          .split(" ")
          .slice(0, currentWordIndex.value)
          .toString().length;
        function getCurrentWordStart() {
          return ((spaces > 0 ? 1 : spaces) + chars) * widthLetter.value.width;
        }
        tapeMarginLeft.value = getCurrentWordStart();
      } else {
        extraLetters.value.pop();
        moveTapeBackward();
      }
    }
    if (appearanceStore.isClassicMode) {
      if (ControlLeft_Backspace.value) {
        currentInput.value = "";
        extraLetters.value = [];
        caretCoordinates.value.left =
          words.value[currentWordIndex.value].getBoundingClientRect().left -
          left.value;
      } else {
        extraLetters.value.pop();
        moveCaretBackward();
      }
    }
  }
});

watch(isTestEnded, (currTestEndedState) => {
  if (currTestEndedState) {
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
    if (appearanceStore.isClassicMode) {
      writtenWords.value.push(currentWord.value);
      clearCurrentInput();
      currentWordIndex.value += 1;
      setCaretCoordinates();
      if (rowNumber.value === "3") {
        classicMarginTop.value -= rows.value[1] - rows.value[0];
        setCaretCoordinates(0, rows.value[1]);
      }
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
