<template>
  <div class="max-w-[1440px] mx-auto">
    <div class="title mb-6">
      <div
        class="mb-3 flex gap-2 items-center justify-start text-2xl text-text"
      >
        <i class="fa-solid fa-palette"></i>
        <h2 class="">Цветовые схемы</h2>
      </div>
      <div class="options mb-3 flex gap-2">
        <button
          class="px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
          :class="[
            !colorThemeStore.isPresetMode
              ? 'text-background bg-primary'
              : 'text-sub bg-text',
          ]"
          @click="colorThemeStore.setCustomMode()"
        >
          Кастомные
        </button>
        <button
          class="px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
          :class="[
            colorThemeStore.isPresetMode
              ? 'text-background bg-primary'
              : 'text-sub bg-text',
          ]"
          @click="colorThemeStore.setPresetMode()"
        >
          Встроенные
        </button>
      </div>
    </div>
    <PresetThemeList v-if="colorThemeStore.isPresetMode" />
    <ColorCustomPalette v-if="!colorThemeStore.isPresetMode" />
  </div>
</template>

<script setup>
import PresetThemeList from "./PresetThemeList.vue";
import ColorCustomPalette from "./ColorCustomPalette.vue";
import { useColorThemeStore } from "@/store/colorThemeStore";


const colorThemeStore = useColorThemeStore();
</script>
