<template>
  <div
    class="relative text-2xl lg:text-3xl text-primary flex place-content-start gap-4 xl:gap-6 transition-all ease-linear duration-75"
    ref="wrapper"
    :class="[props.isInputFocused ? 'blur-none' : 'blur-sm']"
    :style="props.wordsWrapperStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { useTemplateRef } from "vue";
const props = defineProps(["isInputFocused", "wordsWrapperStyle"]);

const wrapper = useTemplateRef("wrapper");

defineExpose({ wrapper });
</script>
