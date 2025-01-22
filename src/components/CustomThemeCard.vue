<template>
  <div
    ref="theme-card"
    class="flex justify-between w-full p-2 md:px-4 rounded-md cursor-pointer bg-background border-2 border-primary text-primary hover:bg-sub transition-colors"
    @click="colorThemeStore.setCurrentThemeValues(props.properties)"
  >
    <ModalUi
      :is-open="isDeleteModalOpen"
      @modal-close="isDeleteModalOpen = false"
    >
      <div class="flex flex-col gap-4">
        <p class="text-2xl text-text">Удалить кастомную тему</p>
        <p class="text-xl">Вы уверены?</p>
        <div class="flex gap-2">
          <button
            @click.stop="isDeleteModalOpen = false"
            class="w-full bg-text hover:bg-primary hover:text-background rounded-md transition-colors"
          >
            Отменить
          </button>
          <button
            @click.stop="colorThemeStore.deleteCustomTheme(props.id)"
            class="w-full bg-text hover:bg-primary hover:text-background rounded-md transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </ModalUi>
    <ModalUi
      :is-open="isUpdateModalOpen"
      @modal-close="isUpdateModalOpen = false"
    >
      <div class="flex flex-col gap-2">
        <p class="text-2xl">Обновить цветовую тему</p>
        <div>
          <input
            type="text"
            name="theme-name"
            id="theme-name"
            v-model="themeName"
            class="bg-text p-1 rounded-md"
          />
          <label for="theme-name"></label>
        </div>
        <div class="flex gap-2 items-center justify-start">
          <input
            v-model="isPropertiesUpdated"
            type="checkbox"
            id="use-current-colors"
            name="use-current-colors"
            class="size-4"
          />
          <label for="use-current-colors"
            >Использовать введённые значения</label
          >
        </div>
        <button
          @click="
            colorThemeStore.updateCustomTheme(
              props.id,
              themeName,
              isPropertiesUpdated
            ),
              (isUpdateModalOpen = false)
          "
          class="bg-text hover:bg-primary hover:text-background"
        >
          Обновить
        </button>
      </div>
    </ModalUi>
    <button
      @click.stop="isUpdateModalOpen = true"
      class="text-text hover:text-primary transition-colors"
    >
      <i class="fa-solid fa-pen"></i>
    </button>
    <p>
      {{ props.name }}
    </p>
    <div class="flex gap-2">
      <button
        @click.stop="isDeleteModalOpen = true"
        class="text-text hover:text-primary transition-colors"
      >
        <i class="fa-solid fa-trash"></i>
      </button>
      <div>
        <button v-if="colorThemeStore.isThemeFavorite(props.id)">
          <i class="fa-solid fa-heart"></i>
        </button>
        <button v-if="!colorThemeStore.isThemeFavorite(props.id)">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useTemplateRef, onMounted, ref } from "vue";
import ModalUi from "./ModalUi.vue";

const props = defineProps(["properties", "name", "id"]);
const colorThemeStore = useColorThemeStore();
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const themeCard = useTemplateRef("theme-card");
const themeName = ref(props.name);
const isPropertiesUpdated = ref(false);
onMounted(() => {
  props.properties.forEach(({ name, value }) => {
    themeCard.value.style.setProperty(`--${name}`, value);
  });
});
</script>

<style>
.sortable-ghost {
  @apply opacity-100;
}
</style>
