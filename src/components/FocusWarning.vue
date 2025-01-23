<template>
  <div
    v-show="!props.isInputFocused"
    class="text-sm xl:text-sm absolute left-0 top-0 bottom-0 flex justify-center items-center w-full text-center text-sub"
  >
    <span
      ><i class="fa-solid fa-arrow-pointer mr-2"></i>Клик здесь для фокуса
      <br />или нажмите любую кнопку</span
    >
  </div>
</template>

<script setup>
const props = defineProps(["isInputFocused"]);
</script>
