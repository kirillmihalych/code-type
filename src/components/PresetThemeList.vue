<template>
  <div class="grid gap-2">
    <div class="grid gap-2">
      <h2 class="text-2xl text-text">Воспроизводить только выбранные</h2>
      <p class="text-sm text-sub">
        По умолчанию на каждый новый тест ставится случайная тема. Опция
        избранные будет воспроизводить темы только из избранных. Опция все будет
        воспроизводить все темы из пресета.
      </p>
      <div class="flex gap-2">
        <button
          class="px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
          :class="[
            colorThemeStore.playOnlyFavorites
              ? 'text-background bg-primary'
              : 'text-sub bg-text',
          ]"
          @click="colorThemeStore.setPlayOnlyFavorites"
          :disabled="selectedThemesDisabled"
        >
          Избранные
        </button>
        <button
          class="px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
          :class="[
            !colorThemeStore.playOnlyFavorites
              ? 'text-background bg-primary'
              : 'text-sub bg-text',
          ]"
          @click="colorThemeStore.setPlayAllThemes"
        >
          Все
        </button>
      </div>
    </div>
    <div class="select-none">
      <div class="grid gap-2">
        <h2 class="text-xl text-text">Избранные</h2>
        <draggable
          group="preset-themes"
          :list="colorThemeStore.selectedPresetThemes"
          :animation="75"
          item-key="name"
          class="flex flex-col md:grid md:grid-cols-4 gap-2 w-full min-h-16 bg-text rounded-md p-2"
        >
          <template #item="{ element: theme }">
            <div>
              <PresetThemeCard :theme="theme" />
            </div>
          </template>
        </draggable>
      </div>
      <div class="grid gap-2">
        <h2 class="text-xl text-text">Встроенные темы</h2>
        <draggable
          group="preset-themes"
          :list="colorThemeStore.presetThemes"
          :animation="200"
          item-key="name"
          handle=".handle"
          class="flex flex-col md:grid md:grid-cols-4 gap-2 w-full min-h-16 bg-text rounded-md p-2"
        >
          <template #item="{ element: theme }">
            <div>
              <PresetThemeCard :theme="theme" />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";
import draggable from "vuedraggable";
import PresetThemeCard from "./PresetThemeCard.vue";

const colorThemeStore = useColorThemeStore();

const selectedThemesDisabled = computed(() => {
  return colorThemeStore.selectedPresetThemes.length <= 0 ? true : false;
});
</script>
