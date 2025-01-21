<template>
  <div>
    <div>
      <draggable
        group="custom-themes"
        v-model="colorThemeStore.colorThemes"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        class="grid gap-2 md:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <template #item="{ element: theme }">
          <PresetThemeCard :theme="theme" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import draggable from "vuedraggable";
import PresetThemeCard from "./PresetThemeCard.vue";

const colorThemeStore = useColorThemeStore();
</script>
