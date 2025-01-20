<template>
  <div class="flex gap-2">
    <div
      v-for="(customTheme, index) in colorThemeStore.colorThemesStorage"
      :key="index"
      class="flex justify-between w-full p-2 md:px-4 rounded-md cursor-pointer bg-primary text-background hover:bg-sub transition-colors"
      @click="colorThemeStore.setCurrentThemeValues(customTheme.properties)"
    >
      <button>
        <i class="fa-solid fa-pen text-text"></i>
      </button>
      <p>
        {{ customTheme.name }}
      </p>
      <button @click="colorThemeStore.deleteCustomTheme(customTheme.id)">
        <i class="fa-solid fa-trash text-text"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";

const colorThemeStore = useColorThemeStore();
</script>
