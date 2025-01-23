<template>
  <nav class="text-text flex justify-center items-center gap-2 min-h-16">
    <RouterLink
      v-for="routeName in routeNames"
      :key="routeName"
      :to="{ name: routeName }"
      class="hover:text-sub transition-colors duration-75"
    >
      <i
        :class="[
          routeName === 'game' ? 'fa-regular fa-keyboard' : 'fa-solid fa-gear',
        ]"
      ></i>
    </RouterLink>
  </nav>
</template>

<script setup>
import { routes } from "@/router";

const routeNames = routes.map((route) => route.name);
</script>
