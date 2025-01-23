import { createWebHistory, createRouter } from "vue-router";

import GameView from "@/views/GameView.vue";
import SettingsView from "@/views/SettingsView.vue";

const routes = [
  { name: "game", path: "/", component: GameView },
  { name: "settings", path: "/settings", component: SettingsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router, routes };
