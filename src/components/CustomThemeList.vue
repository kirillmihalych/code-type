<template>
  <div class="text-sub">
    <div>
      <h2>Фавориты</h2>
      <draggable
        group="custom-themes"
        :list="colorThemeStore.favoriteCustomThemes"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        class="flex flex-col md:flex-row gap-2 w-full min-h-16 border-2 border-sub rounded-md p-2"
      >
        <template #item="{ element }">
          <CustomThemeCard
            :name="element.name"
            :properties="element.properties"
            :id="element.id"
          />
        </template>
      </draggable>
    </div>
    <div>
      <h2>Созданные темы</h2>
      <draggable
        :list="colorThemeStore.savedThemes"
        group="custom-themes"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        class="flex flex-col md:flex-row gap-2 w-full min-h-16 border-2 border-sub rounded-md p-2"
      >
        <template #item="{ element }">
          <CustomThemeCard
            :name="element.name"
            :properties="element.properties"
            :id="element.id"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import CustomThemeCard from "./CustomThemeCard.vue";
import draggable from "vuedraggable";

const colorThemeStore = useColorThemeStore();
</script>

<style>
/* 
 */
</style>
