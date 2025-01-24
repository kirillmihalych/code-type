<template>
  <div
    class="flex justify-between items-center uppercase text-center text-primary bg-background p-2 rounded-md cursor-pointer"
    :class="[
      props.theme.name,
      isThemeSelected ? 'border-2 border-sub' : 'border-2 border-transparent',
    ]"
    @click="colorThemeStore.selectTheme(props.theme.id)"
  >
    <div>
      <i class="fa-solid fa-grip handle text-sub hover:cursor-grab"></i>
    </div>
    <h2 class="">{{ props.theme.name }}</h2>
    <div class="flex gap-1">
      <div class="size-4 rounded-full bg-sub"></div>
      <div class="size-4 rounded-full bg-primary"></div>
      <div class="size-4 rounded-full bg-text"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";

const props = defineProps(["theme"]);

const colorThemeStore = useColorThemeStore();
const isThemeSelected = computed(() => {
  return props.theme.name === colorThemeStore.colorThemeName;
});
</script>

<style>
.sortable-ghost {
  @apply opacity-100;
}
</style>
