<template>
  <div
    ref="theme-card"
    class="flex justify-between w-full p-2 md:px-4 rounded-md cursor-pointer bg-background border-2 border-primary text-background hover:bg-sub transition-colors"
    @click="colorThemeStore.setCurrentThemeValues(props.properties)"
  >
    <button>
      <i class="fa-solid fa-pen text-text"></i>
    </button>
    <p>
      {{ props.name }}
    </p>
    <button @click.stop="colorThemeStore.deleteCustomTheme(props.id)">
      <i class="fa-solid fa-trash text-text"></i>
    </button>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useTemplateRef, onMounted } from "vue";
const props = defineProps(["properties", "name", "id"]);
const colorThemeStore = useColorThemeStore();

const themeCard = useTemplateRef("theme-card");
onMounted(() => {
  props.properties.forEach(({ name, value }) => {
    themeCard.value.style.setProperty(`--${name}`, value);
  });
});
</script>
