import { ref, onMounted, computed } from "vue";
import { useCurrentElement } from "@vueuse/core";
import { defineStore } from "pinia";

export const useColorThemeStore = defineStore("colorThemes", () => {
  const colorThemes = ref([
    {
      name: "matrix",
      properties: [
        {
          name: "background",
          value: "#000000",
        },
        {
          name: "primary",
          value: "#15ff00",
        },
        {
          name: "caret",
          value: "#15ff00",
        },
        {
          name: "error",
          value: "#da3333",
        },
        {
          name: "text",
          value: "#006500",
        },
        {
          name: "sub",
          value: "#d1ffcd",
        },
      ],
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
    setCustomTheme();
  }
  function setPresetMode() {
    themeSettingsMode.value = "preset";
    styleReset();
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
  const currentThemeValues = ref([]);
  function usePropertyValue() {
    const properties = colorThemes.value[currentThemeIndex.value].properties;
    setCurrentThemeValues(properties);
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
  function setCustomTheme() {
    selectedThemeValues.value.map(({ name, value }) => {
      el.value.style.setProperty(`--${name}`, value);
    });
  }
  // ====================================
  const customTheme = ref([
    {
      name: "background",
      value: "#0e0e0e",
    },
    {
      name: "primary",
      value: "#ff9900",
    },
    {
      name: "caret",
      value: "#ff9900",
    },
    {
      name: "error",
      value: "#e44545",
    },
    {
      name: "text",
      value: "#555555",
    },
    {
      name: "sub",
      value: "#c6c6c6",
    },
  ]);
  const selectedThemeValues = computed(() => {
    return currentThemeValues.value.length > 0
      ? currentThemeValues.value
      : customTheme.value;
  });

  function styleReset() {
    el.value.style = null;
  }

  // handle custom themes in local storage
  const savedThemes = ref([]);
  function saveCustomTheme() {
    savedThemes.value.push({
      id: Date.now(),
      name: "custom",
      properties: selectedThemeValues.value,
    });
    localStorage.setItem("custom-themes", JSON.stringify(savedThemes.value));
  }
  function getCustomThemes() {
    const data = localStorage.getItem("custom-themes");
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }
  function deleteCustomTheme(themeId) {
    savedThemes.value = savedThemes.value.filter((custom) => {
      return custom.id !== themeId;
    });
    localStorage.setItem("custom-themes", JSON.stringify(savedThemes.value));
  }
  const isUpdateOpen = ref(false);
  function openUpdateModal() {
    isUpdateOpen.value = true;
  }
  function closeUpdateModal() {
    isUpdateOpen.value = false;
  }
  function updateCustomTheme(id, name, isPropertiesUpdated) {
    const currentTheme = savedThemes.value.find((theme) => theme.id === id);
    currentTheme.name = name;
    if (isPropertiesUpdated) {
      currentTheme.properties = selectedThemeValues.value;
    }
    localStorage.setItem("custom-themes", JSON.stringify(savedThemes.value));
  }

  onMounted(() => {
    isUserSetHisTheme.value = false;
    setRandomTheme();
    savedThemes.value = getCustomThemes();
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
    themeSettingsMode,
    setCustomTheme,
    savedThemes,
    customTheme,
    saveCustomTheme,
    selectedThemeValues,
    deleteCustomTheme,
    isUpdateOpen,
    openUpdateModal,
    closeUpdateModal,
    updateCustomTheme,
  };
});