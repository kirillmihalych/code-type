<template>
  <div>
    <div>
      <div class="flex gap-2 items-center justify-start text-2xl text-text">
        <i class="fa-solid fa-palette"></i>
        <h2 class="">Цветовые схемы</h2>
      </div>
      <div class="options flex gap-2">
        <button
          class="border-2 border-text rounded-md"
          @click="colorThemeStore.setCustomMode()"
        >
          Кастомные
        </button>
        <button
          class="border-2 border-text rounded-md"
          @click="colorThemeStore.setPresetMode()"
        >
          Встроенные
        </button>
      </div>
      <ColorThemeList v-if="colorThemeStore.isPresetMode" />
      <ColorCustomPalette v-if="!colorThemeStore.isPresetMode" />
    </div>
  </div>
</template>

<script setup>
import ColorThemeList from "./ColorThemeList.vue";
import ColorCustomPalette from "./ColorCustomPalette.vue";
import { useColorThemeStore } from "@/store/colorThemeStore";

const colorThemeStore = useColorThemeStore();
</script>
