<template>
  <main
    class="grid grid-rows-12 bg-background font-jet-brains py-10 min-h-dvh transition-colors overflow-auto scrollbar scrollbar-thumb-primary scrollbar-track-background h-32"
    :class="[colorThemeStore.colorThemeName]"
  >
    <div id="modal"></div>
    <MainNavigation class="row-span-1 place-self-center" />
    <RouterView class="row-start-4 row-span-7" />
    <!-- <ShortcutsDescription class="row-start-12 row-span-1" /> -->
  </main>
</template>

<script setup>
import { onMounted, watchEffect } from "vue";
import { useFavicon } from "@vueuse/core";
import { useColorThemeStore } from "./store/colorThemeStore";
import MainNavigation from "./components/MainNavigation.vue";
// import ShortcutsDescription from "./components/ShortcutsDescription.vue";

const colorThemeStore = useColorThemeStore();

const icon = useFavicon();

onMounted(() => {
  icon.value = `${colorThemeStore.colorThemeName}-favicon.svg`;
});

watchEffect(() => {
  if (colorThemeStore.colorThemeName) {
    icon.value = `${colorThemeStore.colorThemeName}-favicon.svg`;
  }
});
</script>
