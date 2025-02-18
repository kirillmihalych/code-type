import { defineStore } from "pinia";
import { ref } from "vue";

export const useCaretStore = defineStore("caret", () => {
  const selectedWpm = ref(65);

  return { selectedWpm };
});
