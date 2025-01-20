<template>
  <div class="flex gap-2">
    <CustomThemeCard
      v-for="(customTheme, index) in colorThemeStore.savedThemes"
      :key="index"
      :properties="customTheme.properties"
      :name="customTheme.name"
      :id="customTheme.id"
    />
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import CustomThemeCard from "./CustomThemeCard.vue";

const colorThemeStore = useColorThemeStore();
</script>

<style>
/* 
- [ ] пофиксить ошибку, при создании новой кастомной темы, обновляется значение уже созданной
===
- [ ] когда я меняю значение в инпуте, реактивно меняется значение во всех темах, почему-то
===
пробую разделить логику значений привязанных к форме и момент, что сохраняет эти значения
- [ ]
*/
</style>
