<template>
  <div class="p-4 selection:bg-primary">
    <div class="max-w-[1440px] mx-auto grid gap-2">
      <div class="flex gap-2 items-center justify-start text-2xl text-text">
        <h2 class="text-primary">Цветовые схемы</h2>
      </div>
      <div class="flex gap-2">
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
      <PresetThemeList v-if="colorThemeStore.isPresetMode" />
      <ColorCustomPalette v-if="!colorThemeStore.isPresetMode" />
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import PresetThemeList from "../components/PresetThemeList.vue";
import ColorCustomPalette from "../components/ColorCustomPalette.vue";

const colorThemeStore = useColorThemeStore();
</script>
