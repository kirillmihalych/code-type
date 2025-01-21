<template>
  <Teleport to="#modal">
    <div
      v-if="props.isOpen"
      class="bg-gray-800/30 fixed top-0 left-0 w-dvw h-dvh flex items-center justify-center"
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
import { onClickOutside } from "@vueuse/core";

const props = defineProps(["isOpen"]);
const emits = defineEmits(["modal-close"]);

const modalContent = useTemplateRef("modal-content");
onClickOutside(modalContent, () => emits("modal-close"));
</script>
