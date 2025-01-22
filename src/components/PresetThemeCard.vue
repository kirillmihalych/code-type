<template>
  <div
    class="flex justify-between items-center w-full uppercase text-center text-primary bg-background p-2 rounded-md hover:scale-105 cursor-pointer origin-center transition-transform"
    :class="[
      props.theme.name,
      colorThemeStore.currentThemeIndex === props.theme.id
        ? 'border-4 border-helper'
        : 'border-4 border-transparent',
    ]"
    @click="colorThemeStore.selectTheme(props.theme.id)"
  >
    <button>
      <i class="fa-solid fa-star text-primary"></i>
    </button>
    <h2 class="">{{ props.theme.name }}</h2>
    <div class="flex gap-1">
      <div class="size-4 rounded-full bg-sub"></div>
      <div class="size-4 rounded-full bg-primary"></div>
      <div class="size-4 rounded-full bg-text"></div>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";

const props = defineProps(["theme"]);

const colorThemeStore = useColorThemeStore();
</script>
