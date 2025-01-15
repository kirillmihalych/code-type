<template>
  <div
    v-show="!props.isInputFocused"
    class="text-smallest xl:text-sm absolute top-1/2 w-full text-center text-helper"
  >
    Клик здесь для фокуса или нажмите любую кнопку
  </div>
</template>

<script setup>
const props = defineProps(["isInputFocused"]);
</script>
