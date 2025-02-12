import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppearanceStore = defineStore("appearance", () => {
  const currentMode = ref("tape");
  const isTapeMode = computed(() => {
    return currentMode.value === "tape";
  });
  const isClassicMode = computed(() => {
    return currentMode.value === "classic";
  });
  function toggleMode() {
    currentMode.value = currentMode.value === "tape" ? "classic" : "tape";
  }
  return { currentMode, isTapeMode, isClassicMode, toggleMode };
});
