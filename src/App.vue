<template>
  <!--  place-content-center place-items-center -->
  <main
    ref="main"
    class="grid grid-rows-12 bg-secondary font-jet-brains py-10 min-h-dvh transition-colors"
    :class="[colorTheme]"
  >
    <MainNavigation class="row-span-1 place-self-center" />
    <RouterView
      @color-theme-name="(name) => setColorTheme(name)"
      class="row-start-4 row-span-8"
    />
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
