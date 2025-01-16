import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(PrimeVue);
app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);

app.mount("#app");
