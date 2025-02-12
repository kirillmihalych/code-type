<template>
  <div class="p-4 selection:bg-primary">
    <div class="max-w-[1440px] mx-auto grid gap-2">
      <h2 class="text-primary">Отображение</h2>
      <div>
        <h3 class="text-2xl text-text">Keymap</h3>
        <div class="grid grid-cols-[2fr_1fr] border-4">
          <p class="text-sm text-sub">Показывать раскладку клавиатуры.</p>
          <div class="flex gap-2">
            <button
              class="flex-1 px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
              :class="[
                appearanceStore.isKeymapShown
                  ? 'text-background bg-primary'
                  : 'text-sub bg-text',
              ]"
              @click="appearanceStore.showKeymap"
            >
              Вкл
            </button>
            <button
              class="flex-1 px-2 py-1 rounded-md hover:text-background hover:bg-sub transition-colors"
              :class="[
                !appearanceStore.isKeymapShown
                  ? 'text-background bg-primary'
                  : 'text-sub bg-text',
              ]"
              @click="appearanceStore.hideKeymap"
            >
              Выкл
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppearanceStore } from "@/store/appearanceStore";

const appearanceStore = useAppearanceStore();
</script>
