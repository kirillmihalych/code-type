<template>
  <div class="grid md:grid-cols-2 md:grid-rows-3">
    <div
      v-for="(color, index) in selectedThemeValues"
      :key="index"
      class="grid grid-cols-2"
    >
      <label :for="color.name">{{ color.name }}</label>
      <div class="flex">
        <i class="fa-solid fa-palette"></i>
        <input
          v-model="color.value"
          :name="color.name"
          :id="color.name"
          class="w-full"
        />
      </div>
      <button @click="colorThemeStore.setValue(`--${color.name}`, color.value)">
        change
      </button>
    </div>
    <button @click="colorThemeStore.usePropertyValue" class="border-2">
      Загрузить текущую
    </button>
    <button class="border-2" @click="saveCustomTheme">
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
- [x] показывать значение по нажатию на лоад пресет
- [x] создать объект кастомный темы, который принадлежит пользователю (пользователь может его настраивать)-
- [x] изменить значение css переменной 
- [x] изменить значение css переменной через input
- [x] создавать classObject через vue, чтобы стиль не переписывал пресет классы
- [-] ставить его как тему
- [x] ставить тему через style
- [x] функции установки темы должна сбрасывать поставленные стили
=====
- [x] preset не мешается с custom themes,
потому что custom всегда будет переписывать preset, из-за style
- [x] есть 2 режима, это preset и custom
custom же загружает объекты из локального хранилища, что применяются к style
preset меняет встроенные классы
======
- [x] ставить значения текущей темы в custom theme
- [x] применять кастомные значения
- [x] сохранить тему в локальное хранилище
- [x] достать тему из локального хранилища
- [x] сохранять любое количество
- [x] ставить тему по нажатию 
*/
</style>
