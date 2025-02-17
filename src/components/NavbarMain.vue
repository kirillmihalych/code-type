<template>
  <nav class="text-text flex justify-center items-center gap-2 min-h-16">
    <RouterLink
      v-for="routeName in routeNames"
      :key="routeName"
      :to="{ name: routeName }"
      class="hover:text-sub transition-colors duration-75"
    >
      <i :class="[selectRouteIcon(routeName)]"></i>
    </RouterLink>
  </nav>
</template>

<script setup>
import { routes } from "@/router";

const routeNames = routes.map((route) => route.name);
function selectRouteIcon(name) {
  return name === "game"
    ? "fa-regular fa-keyboard"
    : name === "themes"
    ? "fa-solid fa-palette"
    : name === "appearance"
    ? "fa-solid fa-eye"
    : name === "caret"
    ? "fa-solid fa-i-cursor"
    : "fa-solid fa-gear";
}
</script>
