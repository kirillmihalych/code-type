<template>
  <!-- py-10 h-32 h-[500px] grid grid-rows-12
  - [ ] fix h-32 
  -->
  <main
    class="bg-background font-jet-brains h-dvh transition-colors overflow-y-auto scrollbar scrollbar-thumb-primary scrollbar-track-background"
    :class="[colorThemeStore.colorThemeName]"
  >
    <NavbarMain />
    <RouterView />
    <div id="modal"></div>
  </main>
</template>

<script setup>
import { onMounted, watchEffect } from "vue";
import { useFavicon } from "@vueuse/core";
import { useColorThemeStore } from "./store/colorThemeStore";
import NavbarMain from "./components/NavbarMain.vue";

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
