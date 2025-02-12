import { createWebHistory, createRouter } from "vue-router";

import GameView from "@/views/GameView.vue";
import ThemeSettingsView from "@/views/ThemeSettingsView.vue";
import AppearanceSettingsView from "@/views/AppearanceSettingsView.vue";

const routes = [
  { name: "game", path: "/", component: GameView },
  { name: "themes", path: "/themes", component: ThemeSettingsView },
  {
    name: "appearance",
    path: "/appearance",
    component: AppearanceSettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router, routes };
