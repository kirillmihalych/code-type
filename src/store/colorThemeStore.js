import { ref } from "vue";
import { defineStore } from "pinia";

export const useColorThemeStore = defineStore("colorThemes", () => {
  const colorThemes = ref([
    {
      name: "matrix",
      isAnimated: false,
    },
    {
      name: "fire",
      isAnimated: true,
    },
    {
      name: "iron-man",
      isAnimated: false,
    },
    {
      name: "honey",
      isAnimated: false,
    },
  ]);

  return { colorThemes };
});
