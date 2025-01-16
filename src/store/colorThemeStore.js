import { ref, onMounted, computed } from "vue";
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
  const currentThemeIndex = ref(0);
  const selectedColorTheme = computed(() => {
    return colorThemes.value[currentThemeIndex.value];
  });
  const colorThemeName = computed(() => {
    return selectedColorTheme.value.name;
  });
  const isColorThemeAnimated = computed(() => {
    return selectedColorTheme.value.isAnimated;
  });

  function selectTheme(index) {
    currentThemeIndex.value = index;
  }
  function setRandomTheme() {
    currentThemeIndex.value = Math.floor(
      Math.random() * colorThemes.value.length
    );
  }

  onMounted(() => {
    setRandomTheme();
  });

  return {
    colorThemes,
    colorThemeName,
    currentThemeIndex,
    isColorThemeAnimated,
    setRandomTheme,
    selectTheme,
  };
});
