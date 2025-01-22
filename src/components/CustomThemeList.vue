<template>
  <div class="text-sub">
    <div>
      <!-- @start="drag = true"
      @end="drag = false" -->
      <h2>Фавориты</h2>
      <draggable
        group="custom-themes"
        :list="colorThemeStore.favoriteCustomThemes"
        ghost-class="moving-card"
        item-key="id"
        :animation="75"
        class="flex flex-col md:flex-row gap-2 w-full min-h-16 border-2 border-sub rounded-md p-2"
      >
        <template #item="{ element }">
          <div class="w-full">
            <CustomThemeCard
              :name="element.name"
              :properties="element.properties"
              :id="element.id"
            />
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <!-- @start="drag = true"
      @end="drag = false" -->
      <h2>Созданные темы</h2>
      <draggable
        group="custom-themes"
        :list="colorThemeStore.savedThemes"
        ghost-class="moving-card"
        :animation="75"
        item-key="id"
        class="flex flex-col md:flex-row gap-2 w-full min-h-16 border-2 border-sub rounded-md p-2"
      >
        <template #item="{ element }">
          <div class="w-full">
            <CustomThemeCard
              :name="element.name"
              :properties="element.properties"
              :id="element.id"
            />
          </div>
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

<style scoped>
.moving-card {
  @apply w-full opacity-15 rounded-md border-2 border-black;
}
</style>
