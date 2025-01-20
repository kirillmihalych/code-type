<template>
  <Teleport to="#modal">
    <div
      class="bg-gray-800/30 fixed top-0 left-0 w-dvw h-dvh flex items-center justify-center"
      v-if="colorThemeStore.isUpdateOpen"
    >
      <div
        ref="modal-content"
        class="bg-background text-sub rounded-md border-2 border-primary p-2 w-[95vw]"
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useTemplateRef } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { onClickOutside } from "@vueuse/core";

const modalContent = useTemplateRef("modal-content");

const colorThemeStore = useColorThemeStore();

onClickOutside(modalContent, () => colorThemeStore.closeUpdateModal());
</script>
