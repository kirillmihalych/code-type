<template>
  <div>
    <CustomThemeList class="mb-6" />
    <div class="grid gap-4 md:grid-cols-2 md:grid-rows-3">
      <div
        v-for="(color, index) in colorThemeStore.selectedThemeValues"
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
            @keypress.enter="
              colorThemeStore.setValue(`--${color.name}`, color.value)
            "
            @blur="colorThemeStore.setValue(`--${color.name}`, color.value)"
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
        @click="colorThemeStore.saveCustomTheme"
        class="text-sub bg-text p-1 rounded-md hover:text-background hover:bg-sub transition-colors"
      >
        Сохранить в браузере
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";
import CustomThemeList from "./CustomThemeList.vue";

const colorThemeStore = useColorThemeStore();

const customPaletteInputs = ref([
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
</script>

<style>
/*

*/
</style>
