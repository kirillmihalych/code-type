<template>
  <div class="grid place-content-center place-items-center">
    <div class="row-first flex gap-1 mb-1 xl:gap-2 xl:mb-2">
      <KeyLayout :value="q"> q </KeyLayout>
      <KeyLayout :value="w"> w </KeyLayout>
      <KeyLayout :value="e"> e </KeyLayout>
      <KeyLayout :value="r"> r</KeyLayout>
      <KeyLayout :value="t"> t </KeyLayout>
      <KeyLayout :value="y"> y </KeyLayout>
      <KeyLayout :value="u"> u </KeyLayout>
      <KeyLayout :value="i"> i </KeyLayout>
      <KeyLayout :value="o"> o </KeyLayout>
      <KeyLayout :value="p"> p </KeyLayout>
      <KeyLayout :value="BracketLeft"> [ </KeyLayout>
      <KeyLayout :value="BracketRight"> ] </KeyLayout>
    </div>
    <div class="row-second flex gap-1 mb-1 xl:gap-2 xl:mb-2">
      <KeyLayout :value="a"> a </KeyLayout>
      <KeyLayout :value="s"> s </KeyLayout>
      <KeyLayout :value="d"> d </KeyLayout>
      <KeyLayout :value="f"> f</KeyLayout>
      <KeyLayout :value="g"> g </KeyLayout>
      <KeyLayout :value="h"> h </KeyLayout>
      <KeyLayout :value="j"> j </KeyLayout>
      <KeyLayout :value="k"> k </KeyLayout>
      <KeyLayout :value="l"> l </KeyLayout>
      <KeyLayout :value="Semicolon"> ; </KeyLayout>
      <KeyLayout :value="Quote"> ' </KeyLayout>
    </div>
    <div class="row-second flex gap-1 mb-1 xl:gap-2 xl:mb-2">
      <KeyLayout :value="z"> z </KeyLayout>
      <KeyLayout :value="x"> x </KeyLayout>
      <KeyLayout :value="c"> c </KeyLayout>
      <KeyLayout :value="v"> v</KeyLayout>
      <KeyLayout :value="b"> b </KeyLayout>
      <KeyLayout :value="n"> n </KeyLayout>
      <KeyLayout :value="m"> m </KeyLayout>
      <KeyLayout :value="Comma"> , </KeyLayout>
      <KeyLayout :value="Period"> . </KeyLayout>
      <KeyLayout :value="Slash"> / </KeyLayout>
    </div>
    <KeyLayout :value="Space" class="w-24 xl:w-52"> default </KeyLayout>
  </div>
</template>

<script setup>
import { useMagicKeys } from "@vueuse/core";
import KeyLayout from "./KeyLayout.vue";

const {
  q,
  w,
  e,
  r,
  t,
  y,
  u,
  i,
  o,
  p,
  a,
  s,
  d,
  f,
  g,
  h,
  j,
  k,
  l,
  z,
  x,
  c,
  v,
  b,
  n,
  m,
  Space,
  BracketRight,
  BracketLeft,
  Quote,
  Semicolon,
  Period,
  Comma,
  Slash,
} = useMagicKeys();
</script>
