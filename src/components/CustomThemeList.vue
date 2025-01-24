<template>
  <div class="grid gap-2">
    <div class="grid gap-2">
      <h2 class="text-xl text-sub">Фавориты</h2>
      <draggable
        group="custom-themes"
        :list="colorThemeStore.favoriteCustomThemes"
        item-key="id"
        :animation="75"
        class="flex flex-col md:grid md:grid-cols-4 gap-2 w-full min-h-16 bg-text rounded-md p-2"
        
      >
        <template #item="{ element }">
          <div>
            <CustomThemeCard
              :name="element.name"
              :properties="element.properties"
              :id="element.id"
            />
          </div>
        </template>
      </draggable>
    </div>
    <div class="grid gap-2">
      <h2 class="text-xl text-sub">Созданные темы</h2>
      <draggable
        group="custom-themes"
        :list="colorThemeStore.savedThemes"
        :animation="75"
        handle=".handle"
        item-key="id"
        class="flex flex-col md:grid md:grid-cols-4 gap-2 w-full min-h-16 bg-text rounded-md p-2"
      >
        <template #item="{ element }">
          <div>
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
