<template>
  <div>
    <CustomThemeList class="mb-6" />
    <div class="relative grid gap-4 md:grid-cols-2 md:grid-rows-3">
      <div
        v-for="(color, index) in colorThemeStore.selectedThemeValues"
        :key="index"
        class="grid grid-cols-2"
      >
        <label :for="color.name" class="text-sub">{{ color.name }}</label>
        <div
          ref="pickers"
          v-show="index === selectedIndex"
          class="flex flex-col absolute z-10 rounded-md border-4 border-white bg-white"
        >
          <button
            class="place-self-end size-8 flex items-center justify-center"
            @click="selectIndex(null)"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          <ColorPicker
            :id="color.name"
            :color="color.value"
            :copy="useCopy"
            alpha-channel="hide"
            :visible-formats="['hex']"
            default-format="hex"
            @color-change="
              (e) => {
                color.value = e.cssColor;
                colorThemeStore.setValue(`--${color.name}`, color.value);
              }
            "
          />
        </div>
        <div class="flex items-center gap-2">
          <i
            @click="selectIndex(index)"
            class="fa-solid fa-palette h-full text-xl flex items-center justify-center aspect-square rounded-md"
            :class="
              color.name === 'background'
                ? 'text-sub bg-bg'
                : color.name === 'primary'
                ? 'text-background bg-primary'
                : color.name === 'caret'
                ? 'text-background bg-caret'
                : color.name === 'text'
                ? 'text-background bg-text'
                : color.name === 'sub'
                ? 'text-background bg-sub'
                : 'text-background bg-error'
            "
          ></i>
          <div>
            <input
              v-model="color.value"
              :name="color.name"
              :id="color.name"
              @keypress.enter="
                colorThemeStore.setValue(`--${color.name}`, color.value)
              "
              @blur="colorThemeStore.setValue(`--${color.name}`, color.value)"
              class="w-full rounded-md p-1 bg-text text-sub outline-sub selection:text-text"
            />
          </div>
        </div>
      </div>
      <button
        @click="colorThemeStore.usePropertyValue"
        class="text-sub bg-text p-1 rounded-md hover:text-background hover:bg-sub transition-colors"
      >
        Загрузить текущую
      </button>
      <button
        @click="colorThemeStore.saveCustomTheme"
        class="text-sub bg-text p-1 rounded-md hover:text-background hover:bg-sub transition-colors"
      >
        Сохранить в браузере
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onUpdated } from "vue";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useClipboard, onClickOutside } from "@vueuse/core";
import CustomThemeList from "./CustomThemeList.vue";
import { ColorPicker } from "vue-accessible-color-picker";

const pickers = useTemplateRef("pickers");
const colorThemeStore = useColorThemeStore();
const { copy: useCopy } = useClipboard();
const selectedIndex = ref(null);
function selectIndex(idx) {
  selectedIndex.value = idx;
}

onUpdated(() => {
  onClickOutside(pickers.value[selectedIndex.value], () => selectIndex(null));
});
</script>

<style>
@import url("vue-accessible-color-picker/styles");
</style>
