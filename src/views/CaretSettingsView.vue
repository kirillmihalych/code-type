<template>
  <div class="p-4 selection:bg-primary">
    <div class="max-w-[1440px] mx-auto grid gap-2">
      <h2 class="text-primary">Курсор</h2>
      <div>
        <h3 class="text-2xl text-text">Скорость второго курсора</h3>
        <div class="grid gap-2 lg:grid-cols-[2fr_1fr]">
          <p class="text-sm text-sub">
            Установить скорость второго курсора, что будет двигаться на
            постоянной скорости.
          </p>
          <div class="flex gap-2">
            <input
              v-model="caretStore.selectedWpm"
              class="w-full rounded-md p-1 bg-text text-sub outline-sub selection:text-text"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCaretStore } from "@/store/caretStore";

const caretStore = useCaretStore();
</script>
