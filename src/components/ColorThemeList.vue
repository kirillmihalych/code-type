<template>
  <div>
    <div class="grid gap-2 md:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(theme, index) in colorThemeStore.colorThemes"
        :key="theme.name"
        class="flex justify-between items-center w-full uppercase text-center text-primary bg-background p-2 rounded-md hover:scale-105 cursor-pointer origin-center transition-transform"
        :class="[
          theme.name,
          colorThemeStore.currentThemeIndex === index
            ? 'border-4 border-helper'
            : 'border-4 border-transparent',
        ]"
        @click="colorThemeStore.selectTheme(index)"
      >
        <button>
          <i class="fa-solid fa-star text-primary"></i>
        </button>
        <h2 class="">{{ theme.name }}</h2>
        <div class="flex gap-1">
          <div class="size-4 rounded-full bg-helper"></div>
          <div class="size-4 rounded-full bg-primary"></div>
          <div class="size-4 rounded-full bg-text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
// import { ref, watchEffect } from "vue";

const colorThemeStore = useColorThemeStore();
</script>
