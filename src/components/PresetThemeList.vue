<template>
  <div>
    <div>
      <h2 class="text-2xl text-primary">Воспроизводить только выбранные</h2>
      <p class="text-sm text-sub mb-4">
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
    <div>
      <h2>Избранные</h2>
      <draggable
        group="preset-themes"
        :list="colorThemeStore.selectedPresetThemes"
        ghost-class="moving-card"
        :animation="200"
        item-key="name"
        class="flex flex-col md:flex-row gap-2 w-full min-h-16 border-2 border-sub rounded-md p-2"
      >
        <template #item="{ element: theme }">
          <div class="w-full">
            <PresetThemeCard :theme="theme" />
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <h2>Встроенные темы</h2>
      <draggable
        group="preset-themes"
        :list="colorThemeStore.presetThemes"
        ghost-class="moving-card"
        :animation="200"
        item-key="name"
        class="grid gap-2 md:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <template #item="{ element: theme }">
          <div>
            <PresetThemeCard :theme="theme" />
          </div>
        </template>
      </draggable>
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

<style>
.moving-card {
  @apply w-full opacity-50 bg-background;
}
</style>
