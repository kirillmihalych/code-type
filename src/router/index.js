import { createWebHistory, createRouter } from "vue-router";

import GameView from "@/views/GameView.vue";
import ThemeSettingsView from "@/views/ThemeSettingsView.vue";
import AppearanceSettingsView from "@/views/AppearanceSettingsView.vue";
import CaretSettingsView from "@/views/CaretSettingsView.vue";

const routes = [
  { name: "game", path: "/", component: GameView },
  { name: "themes", path: "/themes", component: ThemeSettingsView },
  {
    name: "appearance",
    path: "/appearance",
    component: AppearanceSettingsView,
  },
  {
    name: "caret",
    path: "/caret",
    component: CaretSettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router, routes };
