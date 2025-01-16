<template>
  <main
    ref="main"
    class="grid grid-rows-12 bg-secondary font-jet-brains py-10 min-h-dvh transition-colors"
    :class="[colorThemeStore.colorThemeName]"
  >
    <MainNavigation class="row-span-1 place-self-center" />
    <RouterView class="row-start-4 row-span-8" />
  </main>
</template>

<script setup>
import MainNavigation from "./components/MainNavigation.vue";
import { useColorThemeStore } from "./store/colorThemeStore";

const colorThemeStore = useColorThemeStore();
</script>
