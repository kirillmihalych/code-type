<template>
  <div class="grid gap-4 md:grid-cols-2 md:grid-rows-3">
    <div
      v-for="(color, index) in selectedThemeValues"
      :key="index"
      class="grid grid-cols-2"
    >
      <label :for="color.name" class="text-sub">{{ color.name }}</label>
      <div class="flex items-center gap-2">
        <i
          class="fa-solid fa-palette h-full text-xl flex items-center justify-center aspect-square rounded-md"
          :class="
            color.name === 'background'
              ? 'text-sub bg-text'
              : color.name === 'primary'
              ? 'text-background bg-primary'
              : color.name === 'caret'
              ? 'text-background bg-caret'
              : color.name === 'text'
              ? 'text-background bg-text'
              : color.name === 'sub'
              ? 'text-background bg-sub'
              : 'text-background bg-error'
          "
        ></i>
        <input
          v-model="color.value"
          :name="color.name"
          :id="color.name"
          class="w-full rounded-md p-1 bg-text text-sub outline-sub selection:text-text"
        />
      </div>
      <!-- <button @click="colorThemeStore.setValue(`--${color.name}`, color.value)">
        change
      </button> -->
    </div>
    <button
      @click="colorThemeStore.usePropertyValue"
      class="text-sub bg-text p-1 rounded-md hover:text-background hover:bg-sub transition-colors"
    >
      Загрузить текущую
    </button>
    <button
      @click="saveCustomTheme"
      class="text-sub bg-text p-1 rounded-md hover:text-background hover:bg-sub transition-colors"
    >
      Сохранить в браузере
    </button>

    <!-- test custom themes -->
    <div class="flex gap-2">
      <div
        v-for="(customTheme, index) in savedThemes"
        :key="index"
        class="border-2 cursor-pointer"
        @click="colorThemeStore.setCurrentThemeValues(customTheme.properties)"
      >
        <p class="bg-background text-primary">
          {{ customTheme.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";

const colorThemeStore = useColorThemeStore();
const savedThemes = ref([]);

const customTheme = ref([
  {
    name: "background",
    value: "#ce1226",
  },
  {
    name: "primary",
    value: "#fcd116",
  },
  {
    name: "caret",
    value: "#fcd116",
  },
  {
    name: "error",
    value: "#1672fc",
  },
  {
    name: "text",
    value: "#6d0f19",
  },
  {
    name: "sub",
    value: "#9f1020",
  },
]);
const selectedThemeValues = computed(() => {
  return colorThemeStore.currentThemeValues.length > 0
    ? colorThemeStore.currentThemeValues
    : customTheme.value;
});

function saveCustomTheme() {
  const data = getCustomThemes();
  data.push({
    id: Date.now(),
    name: "custom",
    properties: selectedThemeValues.value,
  });
  console.log(savedThemes.value);
  localStorage.setItem("custom-themes", JSON.stringify(data));
}

function getCustomThemes() {
  const themes = JSON.parse(localStorage.getItem("custom-themes"));
  if (themes) {
    return JSON.parse(localStorage.getItem("custom-themes"));
  } else {
    return [];
  }
}

onMounted(() => {
  savedThemes.value = getCustomThemes();
});
</script>

<style>
/* 
- [ ]  
*/
</style>
