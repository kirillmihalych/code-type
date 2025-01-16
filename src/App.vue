<template>
  <main
    ref="main"
    class="bg-secondary grid place-content-center place-items-center font-jet-brains py-10 min-h-dvh transition-colors"
    :class="[colorTheme]"
  >
    <MainNavigation />
    <RouterView @color-theme-name="(name) => setColorTheme(name)" />
  </main>
</template>

<script setup>
import MainNavigation from "./components/MainNavigation.vue";
import { ref } from "vue";

const colorTheme = ref(null);
function setColorTheme(name) {
  colorTheme.value = name;
}
</script>
