import { ref, onMounted, computed } from "vue";
import { useCurrentElement } from "@vueuse/core";
import { defineStore } from "pinia";

export const useColorThemeStore = defineStore("colorThemes", () => {
  const colorThemes = ref([
    {
      name: "matrix",
      isAnimated: true,
    },
    {
      name: "fire",
      isAnimated: true,
    },
    {
      name: "iron-man",
      isAnimated: true,
    },
    {
      name: "honey",
      isAnimated: true,
    },
  ]);
  const currentThemeIndex = ref(0);
  const themeSettingsMode = ref("preset");
  const isPresetMode = computed(() => {
    return themeSettingsMode.value === "preset";
  });
  const selectedColorTheme = computed(() => {
    return colorThemes.value[currentThemeIndex.value];
  });
  const colorThemeName = computed(() => {
    return selectedColorTheme.value.name;
  });
  const isColorThemeAnimated = computed(() => {
    return selectedColorTheme.value.isAnimated;
  });

  function setCustomMode() {
    themeSettingsMode.value = "custom";
  }
  function setPresetMode() {
    themeSettingsMode.value = "preset";
  }
  function selectTheme(index) {
    currentThemeIndex.value = index;
  }
  function setRandomTheme() {
    currentThemeIndex.value = Math.floor(
      Math.random() * colorThemes.value.length
    );
    el.value.style = "";
  }

  const el = useCurrentElement();
  const cssVarNameList = ref([
    "--background",
    "--primary",
    "--caret",
    "--error",
    "--text",
    "--sub",
  ]);
  const currentThemeValues = ref([]);
  function usePropertyValue() {
    currentThemeValues.value = cssVarNameList.value.map((cssVar) => {
      return {
        name: `${cssVar.slice(2)}`,
        value: getComputedStyle(el.value).getPropertyValue(cssVar),
      };
    });
  }
  function setCurrentThemeValues(selectedTheme) {
    currentThemeValues.value = selectedTheme;
    selectedTheme.forEach(({ name, value }) => {
      el.value.style.setProperty(`--${name}`, value);
    });
  }

  const isUserSetHisTheme = ref(false);
  const themeClassObject = ref({
    "--background": "#ce1226",
    "--primary": "#fcd116",
    "--caret": "#fcd116",
    "--error": "#1672fc",
    "--text": "#6d0f19",
    "--sub": "#9f1020",
  });

  function setValue(property, value) {
    isUserSetHisTheme.value = true;
    el.value.style.setProperty(property, value);
  }

  onMounted(() => {
    isUserSetHisTheme.value = false;
    setRandomTheme();
  });

  return {
    colorThemes,
    colorThemeName,
    currentThemeIndex,
    currentThemeValues,
    isColorThemeAnimated,
    usePropertyValue,
    setRandomTheme,
    selectTheme,
    setValue,
    isUserSetHisTheme,
    themeClassObject,
    setCustomMode,
    setPresetMode,
    isPresetMode,
    setCurrentThemeValues,
  };
});
