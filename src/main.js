import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);

app.mount("#app");
