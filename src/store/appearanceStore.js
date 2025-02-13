import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppearanceStore = defineStore("appearance", () => {
  const currentMode = ref("classic");
  const isKeymapShown = ref(true);

  const isTapeMode = computed(() => {
    return currentMode.value === "tape";
  });
  const isClassicMode = computed(() => {
    return currentMode.value === "classic";
  });

  function showKeymap() {
    isKeymapShown.value = true;
  }
  function hideKeymap() {
    isKeymapShown.value = false;
  }
  function setClassicMode() {
    currentMode.value = "classic";
  }
  function setTapeMode() {
    currentMode.value = "tape";
  }
  function toggleMode() {
    currentMode.value = currentMode.value === "tape" ? "classic" : "tape";
  }
  return {
    currentMode,
    isTapeMode,
    isClassicMode,
    toggleMode,
    setTapeMode,
    setClassicMode,
    isKeymapShown,
    hideKeymap,
    showKeymap,
  };
});
